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
