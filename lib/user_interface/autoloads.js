

class AutoloadProcessor {

    constructor(userInterface) {
        this.userInterface = userInterface;
        return this;
    }

    autoload() {
        let config = this.userInterface.storage.config;
        let userInterface = this.userInterface;

        userInterface.commandConsole.dearUser(config.greeting);
  
        userInterface.playlistManager.once('ready', () => {
            if (config.playlist) {
                if (userInterface.playlistManager.getPlaylist(config.playlist)) {
                    userInterface.openPlaylist(config.playlist);
                } else {
                    userInterface.playlistManager.addPlaylist(config.playlist);
                }
                config._.forEach((paramUrl) => {
                    userInterface.storage.JobManager.enqueue('addTrack',
                        paramUrl,
                        config.playlist,
                        userInterface.storage.Playlist,
                        userInterface.storage.Track
                    );
                });
            }
        });

        if (config.autoplay) {
            userInterface.playlistManager
                .initialize({ random: true })
                .then((playlist) => {
                  userInterface.openPlaylistAndShuffle(playlist);
            });
        } else {
            userInterface.playlistManager.initialize();
        }
    }

}

module.exports = AutoloadProcessor;