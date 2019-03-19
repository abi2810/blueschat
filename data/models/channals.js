const DataTypes = require('sequelize');
const sequelize = require('../sequelize');

const Channal = sequelize.define('channal',{
	id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	name:{
		type: DataTypes.STRING(100),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	desc:{
		type: DataTypes.STRING(1000),
		allowNull: true
	}

});

module.exports = Channal;
