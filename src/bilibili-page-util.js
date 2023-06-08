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
