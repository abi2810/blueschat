const DataTypes = require('sequelize');
const sequelize = require('../sequelize');

const Message = sequelize.define('messages',{
	id:{
		type: DataTypes.INTEGER(11),
		allowNull: false,
		primaryKey: true,
		autoIncrement: true
	},
	user_id:{
		type: DataTypes.INTEGER(11),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	channal_id:{
		type: DataTypes.INTEGER(11),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	receiver_id:{
		type: DataTypes.INTEGER(11),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	image_id:{
		type: DataTypes.INTEGER(11),
		allowNull: true,
		primaryKey: false,
		// autoIncrement: true
	},
	message_text:{
		type: DataTypes.STRING(1000),
		allowNull: true
	},
	is_seen:{
		type: DataTypes.INTEGER(1),
		default:0,
		allowNull: true
	}


});

module.exports = Message;
