import RegexHtmlElement from './regex-html-element';

const GITHUB_HOST_URL = "https://github.com";

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
    let assetList = [];
    const spanTag = new RegexHtmlElement('span', false);
    spanTag.setContext('(?<name>[\\s\\S]*?)');
    const aTag = new RegexHtmlElement('a', false);
    aTag.addAttr('href', '(?<url>.*?)');
    aTag.addChildElement(spanTag);
    const liTag = new RegexHtmlElement('li', false);
    liTag.addChildElement(aTag);
    let matchGroups = html.matchAll(liTag.toRegex('g'));
    for (let matchGroup of matchGroups) {
        if(matchGroup.groups && matchGroup.groups.name && matchGroup.groups.url){
            assetList.push({
                name: matchGroup.groups.name,
                url: GITHUB_HOST_URL + matchGroup.groups.url
            })
        }
    }
    return assetList;
}

export const handleDownloadUrl = (html, fileName) => {
    const assetList = handleAssetsInfo(html);
    let url = null;
    if(Array.isArray(assetList)){
        const find = assetList.find(asset => asset.name === fileName);
        if(find){
            url = find.url;
        }
    }
    return url;
}
