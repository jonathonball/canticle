const Op = require('sequelize').Op;

module.exports = function(sequelize, DataTypes) {
    var Playlist = sequelize.define('Playlist', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'Playlist name must be unique.' }
        }
    }, {
        scopes: {
            findAllByName: function(name) {
                return {
                    where: {
                        name: {
                            [Op.like]: '%' + name.trim() + '%'
                        }
                    }
                };
            },
            findByName: function(name) {
                return {
                    where: {
                        name: {
                            [Op.eq]: name.trim()
                        }
                    }
                };
            }
        }
    });

    /**
     * Class method
     * @param string name
     * @return Promise
     */
    Playlist.findAllByName = function(name) {
        return Playlist.scope({ method: ['findAllByName', name]}).findAndCountAll();
    };

    /**
     * Class method
     * @param string name
     * @return Promise
     */
    Playlist.findByName = function(name) {
        return new Promise((resolve, reject) => {
            Playlist.scope({
                method: ['findAllByName', name]
            })
            .findAndCountAll()
            .then((playlists) => {
                if (playlists.count < 1) {
                    reject(Error('Playlist not found'));
                }
                if (playlists.count > 1) {
                    reject(Error('Playlist name was ambiguous'));
                }
                resolve(playlists.rows[0]);
            }).catch((err) => {
                reject(err);
            });
        });
    };

    /**
     * @param string name
     * @return Promise
     */
    Playlist.findOrCreateByName = function(name) {
        return new Promise((resolve, reject) => {
            Playlist.findOrCreate({
                where: {
                    name: name.trim()
                }
            })
            .then((playlist) => {
                resolve(playlist[0]);
            }).
            catch((err) => {
                reject(err);
            });
        });
    };

    /**
     * Instance method
     * @param a job queue manager with an enqueue function
     */
    Playlist.prototype.validateTracks = function(manager) {
        this.getTracks().then((tracks) => {
            tracks.forEach((track, index) => {
                manager.enqueue('validateUrlHasStreams', track, index);
            });
            return null;
        });
    };

    return Playlist;
};
