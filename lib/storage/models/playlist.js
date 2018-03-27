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

    Playlist.findByName = function(name) {
        return Playlist.scope({ method: ['findByName', name]}).findAndCountAll()
    };

    Playlist.prototype.validateTracks = function(manager) {
        this.getTracks().then((tracks) => {
            tracks.forEach((track) => {
                manager.enqueue('validateUrl', track);
            });
            return null;
        });
    };

    return Playlist;
};
