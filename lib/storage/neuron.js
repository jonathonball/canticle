const Neuron = require('neuron');
const YouTubeDl = require('youtube-dl');
const YTHelper = require('./../yt-helper');

const manager = new Neuron.JobManager();

manager.addJob('validateUrlHasStreams', {
    concurrency: 5,
    work: function(track, index) {
        var self = this;
        var result = {
            type: 'validateUrlHasStreams',
            track: track,
            index: index
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

manager.addJob('addTrack', {
    concurrency: 2,
    work: function(url, playlistName, Playlist, Track) {
        var self = this;
        self.result = {
            type: 'addTrack',
            playlist: playlistName,
            title: null,
            url: url
        };
        Playlist.findAllByName(playlistName).then((playlists) => {
            if (playlists.count == 1) {
                YouTubeDl.getInfo(url, function(err, info) {
                    if (info && YTHelper.getStream(info.formats, url)) {
                        Track.create({
                            title: info.title,
                            url: url,
                            playlist_id: playlists.rows[0].id
                        }).then((track) => {
                            self.result.title = track.title;
                            self.result.pass = true;
                            self.finished = true;
                            return null;
                        }).catch((err) => {
                            self.result.error = err;
                            self.result.pass = false;
                            self.result.title = info.title;
                            self.finished = true;
                        });
                    } else {
                        self.result.error = err;
                        self.result.pass = false;
                        self.finished = true;
                    }
                });
            } else {
                self.result.pass = false;
                self.finished = true;
            }
            return null;
        }).catch((err) => {
            self.result.error = err;
            self.result.pass = false;
            self.finished = true;
        });
    }
});

module.exports = manager;
