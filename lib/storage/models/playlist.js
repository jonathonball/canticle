const Op = require('sequelize').Op;

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Playlist', {
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
};
