export class RegexHtmlElement {
    static SPACE_EXIST_MATCH_REGEX = '\\s+?';
    static SPACE_MATCH_REGEX = '\\s*?';
    static LINE_MATCH_REGEX = '.*?';
    static ALL_MATCH_REGEX = '[\\s\\S]*?';

    static BEGIN_TAG_LEFT = '<';
    static END_TAG_LEFT = '</';
    static TAG_RIGHT = '>'
    static SELF_CLOSE_TAG_RIGHT = '/>'

    constructor(name, isSelfClose) {
        this.name = name;
        this.isSelfClose = !!isSelfClose;
        this.attrs = [];
        this.children = [];
        this.content = '';
    }

    addAttr(key, value) {
        this.attrs.push({
            key: key,
            value: value
        })
    }

    addChildElement(tag) {
        if(this.isSelfClose) {
            throw new Error('can not add child tag for self-close tag')
        }
        this.children.push(tag);
        this.content = '';
    }

    setContext(content) {
        if(this.isSelfClose) {
            throw new Error('can not add child tag for self-close tag')
        }
        this.content = content;
        this.children = [];
    }

    toRegex(flag){
        let startTagLeft = RegexHtmlElement.BEGIN_TAG_LEFT + this.name
            + (this.attrs.length > 0 ? RegexHtmlElement.LINE_MATCH_REGEX : '');
        let startTagRight = this.isSelfClose ? RegexHtmlElement.LINE_MATCH_REGEX + RegexHtmlElement.SELF_CLOSE_TAG_RIGHT
            : RegexHtmlElement.LINE_MATCH_REGEX + RegexHtmlElement.TAG_RIGHT;
        let startTagAttrs = this.attrs.map(attr => attr.key + '="' + attr.value + '"')
            .join(RegexHtmlElement.LINE_MATCH_REGEX);
        let reg = startTagLeft + startTagAttrs + startTagRight;
        if(!this.isSelfClose){
            reg = startTagLeft + startTagAttrs + startTagRight;
            if(this.content) {
                reg += this.content;
            }else if(this.children.length > 0){
                reg += RegexHtmlElement.ALL_MATCH_REGEX
                    + this.children.map(tag => tag instanceof RegexHtmlElement ?
                        tag.toRegex().source : tag instanceof String || typeof tag === 'string' ? tag : '')
                        .join(RegexHtmlElement.ALL_MATCH_REGEX)
                    + RegexHtmlElement.ALL_MATCH_REGEX
            }else{
                reg += RegexHtmlElement.ALL_MATCH_REGEX;
            }
            reg += RegexHtmlElement.END_TAG_LEFT + this.name + RegexHtmlElement.TAG_RIGHT;
        }
        return new RegExp(reg, flag);
    }
}

export default RegexHtmlElement;