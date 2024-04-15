const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class User extends Model {}

User.init({
    user_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,  // Automatically generate UUIDs
        primaryKey: true,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    login: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password_hash: {
        type: DataTypes.STRING,
        allowNull: false
    },
    has_played_today: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: 0,
        get() {
            // Convert the tinyint to boolean when accessed
            return this.getDataValue('has_played_today') === 1;
        },
        set(value) {
            // Convert boolean to tinyint for storage
            this.setDataValue('has_played_today', value ? 1 : 0);
        }
    },
    role: {
        type: DataTypes.ENUM,
        values: ['admin', 'mod', 'player'],
        defaultValue: 'player',
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: false
});

module.exports = User;
