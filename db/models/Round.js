const { Model, DataTypes } = require('sequelize');
const sequelize = require('../database');

class Round extends Model {}

Round.init({
    round_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    start_time: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    end_time: {
        type: DataTypes.DATE,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('open', 'closed'),
        defaultValue: 'open'
    }
}, {
    sequelize,
    modelName: 'Round',
    tableName: 'Rounds',
    timestamps: false
});

module.exports = Round;
