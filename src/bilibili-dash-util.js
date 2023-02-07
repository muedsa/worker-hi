export const buildMPD = (dash, filter) => {
  let videoList = dash.video;
  let audioList = dash.audio;
  let videoRepresentationArr = [];
  if(filter){
    videoList = videoList.filter(video => video.codecs.includes(filter));
  }
  videoList.forEach(video => {
    let videoUrl = '<![CDATA[' + video.baseUrl + ']]>';
    videoRepresentationArr.push(`<Representation id="${video.id}_${video.codecid}" codecs="${video.codecs}" bandwidth="${video.bandwidth}" width="${video.width}" height="${video.height}" frameRate="${video.frameRate}" sar="${video.sar}">
                <BaseURL>${videoUrl}</BaseURL>
                <SegmentBase indexRange="${video.SegmentBase.indexRange}">
                	<Initialization range="${video.SegmentBase.Initialization}"/>
                </SegmentBase>
            </Representation>`);
  });
  let audioRepresentationArr = [];
  audioList.forEach(audio => {
    let audioUrl = '<![CDATA[' + audio.baseUrl + ']]>';
    audioRepresentationArr.push(`<Representation id="${audio.id}_${audio.codecid}" codecs="${audio.codecs}" bandwidth="${audio.bandwidth}">
                <BaseURL>${audioUrl}</BaseURL>
                <SegmentBase indexRange="${audio.SegmentBase.indexRange}">
                	<Initialization range="${audio.SegmentBase.Initialization}"/>
                </SegmentBase>
            </Representation>`);
  });
  return `<?xml version="1.0"?>
<MPD xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		xmlns="urn:mpeg:dash:schema:mpd:2011"
		xsi:schemaLocation="urn:mpeg:dash:schema:mpd:2011 DASH-MPD.xsd"
		type="static"
		mediaPresentationDuration="PT` + dash.duration + `S"
		minBufferTime="PT` + dash.minBufferTime + `S"
		profiles="http://dashif.org/guidelines/dash264,urn:mpeg:dash:profile:isoff-on-demand:2011">
    <Period>
    		<AdaptationSet mimeType="video/mp4" contentType="video" subsegmentAlignment="true" subsegmentStartsWithSAP="1">
    		    ${videoRepresentationArr.join('\n')}
    		</AdaptationSet>
    		<AdaptationSet mimeType="audio/mp4" contentType="audio" subsegmentAlignment="true" subsegmentStartsWithSAP="1">
        		${audioRepresentationArr.join('\n')}
        </AdaptationSet>
    </Period>
</MPD>`;
}
