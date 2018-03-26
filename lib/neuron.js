const Neuron = require('neuron');
const YouTubeDl = require('youtube-dl');
const YTHelper = require('./yt-helper');

const manager = new Neuron.JobManager();

manager.addJob('validateUrl', {
    concurrency: 5,
    work: function(track) {
        var self = this;
        var result = {
            track: track
        };
        YouTubeDl.getInfo(track.url, (err, info) => {
            if (info) {
                if (YTHelper.getStream(info.formats, track.url)) {
                    result.pass = true;
                } else {
                    result.pass = false;
                }
            } else {
                result.pass = false;
            }
            self.result = result;
            self.finished = true;
        });
    }
});

module.exports = manager;
