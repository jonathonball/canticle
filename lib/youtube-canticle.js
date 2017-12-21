const youtubedl = require('youtube-dl');
const EventEmitter = require('events');

class YoutubeInfoGather extends EventEmitter {
	constructor() {
		super();
		this._ = {};
	}

	getInfo(url) {
		youtube.getInfo([url], function(err, info) {
			if (err) throw err;

			let audioStreams = info.formats.filter(({vcodec}) => vcodec == 'none');
			let streamData = {
				duration: info.duration,
				realUrl: audioStreams[0].url
			}
			this.emit('youtubeDataFetched', streamData)
		});
	}

}


module.exports = YoutubeInfoGather;
