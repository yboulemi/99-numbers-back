const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database'); 
const User = require('./User');
const Round = require('./Round');

class Pick extends Model {}

Pick.init({
    pick_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    round_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Round,
            key: 'round_id',
        },
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'user_id',
        },
    },
    number_picked: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 99
        }
    },
    is_unique: {
        type: DataTypes.BOOLEAN,
        defaultValue: null, // This will be set after all picks are in
    }
}, {
    sequelize,
    modelName: 'Pick',
    tableName: 'Picks',
    timestamps: false
});

module.exports = Pick;
