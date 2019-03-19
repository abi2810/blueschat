const DataTypes = require('sequelize');
const sequelize = require('../sequelize');

const ChannalUser = sequelize.define('channal_users',{
	id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	user_id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: false,
		autoIncrement: false
	},
	channal_id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: false,
		autoIncrement: false
	},
	

});

module.exports = ChannalUser;
