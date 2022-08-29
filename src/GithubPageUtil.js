import RegexHtmlElement from './RegexHtmlElement';

const GITHUB_HOST_URL = "https://github.com/";

export const handleMetaInfo = (html) => {
    const metaTag = new RegexHtmlElement('meta', true);
    metaTag.addAttr('property', 'og:(?<name>.*?)');
    metaTag.addAttr('content', '(?<value>[\\s\\S]*?)');

    const matchGroups = html.matchAll(metaTag.toRegex('g'));
    let data = {};
    for (let matchGroup of matchGroups) {
        if(matchGroup.groups){
            const name = matchGroup.groups.name;
            const value =  matchGroup.groups.value;
            data[name] = value;
            if(name === 'url') {
                let paths = value.split('/');
                if(paths[paths.length - 2] === 'tag'){
                    data.tag = paths[paths.length - 1];
                }
                data[name] = GITHUB_HOST_URL + data[name];
            }else if(name === 'image:width' || name === 'image:height'){
                data[name] = Number.parseInt(value);
            }
        }
    }
    return data;
}

export const handleAssetsInfo = (html) => {
    const ulTag = new RegexHtmlElement('ul', false);
    ulTag.setContext('(?<ulContent>[\\s\\S]*?)');
    const ulDivTag = new RegexHtmlElement('div', false);
    ulDivTag.addAttr('class', '.*?Box.*?');
    ulDivTag.addChildElement(ulTag);
    const ulDivDivTag = new RegexHtmlElement('div', false);
    ulDivDivTag.addChildElement(ulDivTag);
    const h3Tag = new RegexHtmlElement('h3', false);
    h3Tag.setContext('Assets');
    const summaryTag = new RegexHtmlElement('summary', false);
    summaryTag.addChildElement(h3Tag)
    const detailsTag = new RegexHtmlElement('details', false);
    detailsTag.addChildElement(summaryTag);
    detailsTag.addChildElement(ulDivDivTag);
    const detailsBoxTag = new RegexHtmlElement('div', false);
    detailsBoxTag.addAttr('class', 'Box-footer');
    detailsBoxTag.addChildElement(detailsTag);
    const ulContentHtml = html.match(detailsBoxTag.toRegex()).groups.ulContent;
    const spanTag = new RegexHtmlElement('span', false);
    spanTag.setContext('(?<name>[\\s\\S]*?)');
    const aTag = new RegexHtmlElement('a', false);
    aTag.addAttr('href', '(?<url>.*?)');
    aTag.addChildElement(spanTag);
    const liTag = new RegexHtmlElement('li', false);
    liTag.addChildElement(aTag);
    let matchGroups = ulContentHtml.matchAll(liTag.toRegex('g'));
    let assertList = [];
    for (let matchGroup of matchGroups) {
        if(matchGroup.groups && matchGroup.groups.name && matchGroup.groups.url){
            assertList.push({
                name: matchGroup.groups.name,
                url: GITHUB_HOST_URL + matchGroup.groups.url
            })
        }
    }
    return assertList;
}

export default {
    handleMetaInfo,
    handleAssertInfo: handleAssetsInfo
}
