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
            findByName: function(name) {
                return {
                    where: {
                        name: {
                            [Op.like]: '%' + name + '%'
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
    Playlist.findByName = function(name) {
        return Playlist.scope({ method: ['findByName', name]}).findAndCountAll()
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
