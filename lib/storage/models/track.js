module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Track', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isUrl: true
            }
        }
    });
}
