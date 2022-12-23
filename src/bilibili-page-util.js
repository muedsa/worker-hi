import RegexHtmlElement from './regex-html-element';

export const parseVideoInfo = (html) => {
  const videoInfoScriptTag = new RegexHtmlElement('script', false);
  videoInfoScriptTag.setContext('window\\.\\_\\_INITIAL\\_STATE\\_\\_=([\\s\\S]*?);\\(function\\(\\)[\\s\\S]*?');
  const regExp = videoInfoScriptTag.toRegex();
  const matchStr = html.match(regExp);
  let data = {};
  if(matchStr[1]){
    data = JSON.parse(matchStr[1]);
  }
  return data;
}

export const parsePlayInfo = (html) => {
  const playInfoScriptTag = new RegexHtmlElement('script', false);
  playInfoScriptTag.setContext('window\\.\\_\\_playinfo\\_\\_=([\\s\\S]*?)');
  const regExp = playInfoScriptTag.toRegex();
  const matchStr = html.match(regExp);
  let data = {};
  if(matchStr[1]){
    data = JSON.parse(matchStr[1]);
  }
  return data;
}

const HOME_PAGE_SCRIPT_CONTENT_REG = /<script type="text\/javascript">window\.__pinia=\(function.*?("BV\w+",\d+,.*?)\)\)<\/script>/;

const HOME_PAGE_VIDEO_REG_EXP = /("(?<bv>BV\w+)",(?<cid>\d+),"(?<url>https?:\\u002F\\u002Fwww.bilibili.com\\u002Fvideo\\u002FBV\w+)","(?<coverUrl>https?:\\u002F\\u002F.*?)","(?<title>.*?)",((?<duration>\d+),)?(?<publishTime>\d+),(?<authorMid>\d+),"(?<author>.*?)","(?<authorFaceUrl>https?:\\u002F\\u002F.*?)",(?<viewNum>\d+),(?<likeNum>\d+),(?<danmakuNum>\d+),.*?)/g;

export const parseHomePageVideoList = (html) => {
  const matchStr = html.match(HOME_PAGE_SCRIPT_CONTENT_REG);
  const list = [];
  if(matchStr[1]){
    const content = matchStr[1];
    const matchGroups = content.matchAll(HOME_PAGE_VIDEO_REG_EXP);
    for (let matchGroup of matchGroups) {
      if(matchGroup.groups){
        list.push({
          bv: matchGroup.groups.bv,
          url: matchGroup.groups.url? matchGroup.groups.url.replaceAll('\\u002F', '\u002F') : '',
          title: matchGroup.groups.title? matchGroup.groups.title.replaceAll('\\u002F', '\u002F') : '',
          coverUrl: matchGroup.groups.coverUrl? matchGroup.groups.coverUrl.replaceAll('\\u002F', '\u002F') : '',
          duration: matchGroup.groups.duration? parseInt(matchGroup.groups.duration) : -1,
          publishTime: matchGroup.groups.publishTime? parseInt(matchGroup.groups.publishTime) : -1,
          authorMid: matchGroup.groups.authorMid? parseInt(matchGroup.groups.authorMid) : -1,
          author: matchGroup.groups.author? matchGroup.groups.author.replaceAll('\\u002F', '\u002F') : '',
          authorFaceUrl: matchGroup.groups.authorFaceUrl? matchGroup.groups.authorFaceUrl.replaceAll('\\u002F', '\u002F') : '',
          viewNum: matchGroup.groups.viewNum? parseInt(matchGroup.groups.viewNum) : -1,
          likeNum: matchGroup.groups.likeNum? parseInt(matchGroup.groups.likeNum) : -1,
          danmakuNum: matchGroup.groups.danmakuNum? parseInt(matchGroup.groups.danmakuNum) : -1,
        });
      }
    }
  }
  return list;
}
