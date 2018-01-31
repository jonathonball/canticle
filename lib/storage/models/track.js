module.exports = function(sequelize, DataTypes) {
    return sequelize.define('Track', {
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: { msg: 'Track title must not be empty.' }
            }
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: { msg: 'Track URI must not exist in database.' },
            validate: {
                isUrl: { msg: 'Track must be a well formatted URI.' }
            }
        }
    });
}
