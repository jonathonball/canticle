module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Playlist', {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    });
}
