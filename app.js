const express = require('express');
var ejs = require('ejs')
const path =require('path');
var sequelize = require('sequelize');
var multer = require('multer')

// const bodyParser = require('body-parser');

const app = express();
app.set('view engine', 'ejs')
app.use(express.static('/images'))
// app.use(bodyParser);
app.use(express.static(path.join(__dirname,'public')));

const User = require('./data/models/users');
const Channal = require('./data/models/channals');
const ChannalUser = require('./data/models/channal_users');
const Message = require('./data/models/messages');
const Image = require('./data/models/images');



app.get('/hello', (req,res) =>{
	res.send('Its working');
})

// Admin add new User
app.post('/addUser', async(req,res) => {
	let checkUser = await User.findOne({where:{name:req.query.name}})
	if (!checkUser) {
		let newUser = await User.create({
			name: req.query.name
		})
		res.send({newUser:newUser});
	}
	else{
		res.send({status:'The name you given is already availble'})
	}
})

// Create a Channal
app.post('/addChannal', async(req,res) => {
	let checkChannal = await Channal.findOne({where:{name:req.query.name}})
	if (!checkChannal) {
		let newChannal = await Channal.create({
			name: req.query.name,
			desc: req.query.channal_desc
		})
		res.send({newChannal:newChannal});
	}else{
		res.send({status:'Channal is already availble'})
	}
	
})

// Show channal list
app.get('/showChannal', async(req,res) => {
	let getChannal = await Channal.findAll();
	res.send({getChannal:getChannal})
})

// Add users to channal
app.post('/addUserChannal', async(req,res) => {
	let chackChannal = await Channal.findOne({where:{id: req.query.channal_id}})
	if (chackChannal) 
	{
		let checkUser = await ChannalUser.findOne({where:{channal_id:req.query.channal_id,user_id: req.query.user_id}})
		if (!checkUser) {
			let addUC = await ChannalUser.create({
			channal_id: chackChannal.id,
			user_id : req.query.user_id
			})
			res.send(addUC)
		}else{
			res.send('You are already added to channal')
		}
		
	}else{
		res.send('There is no channal availble');
	}
})

// Get Users list by channal
app.get('/listUsersChannnal', async(req,res) => {
	let getChannal = await ChannalUser.findAll({where:{channal_id: req.query.channal_id}})
	res.send(getChannal)
})

// Show users list
app.get('/showUsers', async(req,res) => {
	let arr = [];
	let arr1 = [];
	let checkUser = await User.findOne({where:{id: req.query.user_id}})
	if (checkUser) {
		let getUserChannal = await ChannalUser.findAll({where:{
				user_id: checkUser.id
			}}
		);
		let loopChannal = await getUserChannal.map(async(li) => {
			let getChannalDet = await Channal.findOne({where:{id: li.channal_id}})
			let hashCha = {};
			hashCha['name'] = getChannalDet.name
			hashCha["channal_desc"] = getChannalDet.desc
			hashCha['user_id'] = li.user_id
			// console.log('arr')
			// console.log(arr)
			arr.push(hashCha)

		})
		
		let getUserFrnds = await Message.findAll({where:{user_id:checkUser.id}})
		let getUserRec = await Message.findAll({where:{receiver_id:checkUser.id}})
		let resultMsg = getUserFrnds.concat(getUserRec)
		// let getUser
		let loopReceiver = await resultMsg.map(async(th) => {
			if (th.receiver_id !== null) {
				// let getUser = await User.findOne({where:{id:th.receiver_id}})
				let getUser1 = await User.findOne({where:{id:th.user_id}})
				// console.log('getUser')
				// console.log({getUser,getUser1})
				// let userN = getUser.name
				// let receiverN = getUser1.name
				let resList = getUser1.name
				
				let nameUser = resList
				console.log(nameUser)
				let hashUs = {}
				hashUs['user_friends'] = nameUser
				arr1.push(hashUs) 
			}
		})
		await Promise.all(loopChannal);
		await Promise.all(loopReceiver);
		let result = {}
		result['ChannalList'] = arr
		// result['FriendsList'] = arr1
		result['FriendsList'] = [...new Set(arr1.map(x => x.user_friends))]
		// console.log(arr1)

		res.send(result)
	}
	else{
		res.send('No user available')
	}
})

var upload = multer({ dest: 'images/' })

// Add message by user to channal and one to one
app.post('/sendMessage', upload.single('image'), async(req,res) => {
	var putImg
	if (req.query.channal_id) 
	{
		let getMsg
		let checkUserChannal = await ChannalUser.findOne({where:{user_id:req.query.user_id,channal_id:req.query.channal_id}})
		if(checkUserChannal){
			if (req.file) {
				let filename = req.file.path
				putImg = await Image.create({name: filename})
				let imageId = await Image.findOne({where:{name: filename},attributes:['id']})
				let userId = checkUserChannal.dataValues.user_id
				let channalId = checkUserChannal.dataValues.channal_id
				getMsg = await Message.create({
					user_id: userId,
					channal_id: channalId,
					message_text: req.query.message_text,
					image_id:imageId.id

				})
			}
			else{
				let userId = checkUserChannal.dataValues.user_id
				let channalId = checkUserChannal.dataValues.channal_id
				getMsg = await Message.create({
					user_id: userId,
					channal_id: channalId,
					message_text: req.query.message_text,
					// image_id:imageId.id

				})
			}
			res.send(getMsg);
			
		}else{
			res.send('No user or channal available');
		}
	}
	else if(req.query.receiver_id){
		let putMsg
		let checkUser = await User.findOne({where:{id:req.query.receiver_id}})
		if (checkUser) {
			if (req.file)
			{	
				let filename = req.file.path
				putImg = await Image.create({name: filename})
				let imageId = await Image.findOne({where:{name: filename},attributes:['id']})
				putMsg = await Message.create({
					user_id: req.query.user_id,
					receiver_id: req.query.receiver_id,
					// channal_id:'nil',
					message_text: req.query.message_text,
					image_id:imageId.id

				})
			}
			else{
				putMsg = await Message.create({
					user_id: req.query.user_id,
					receiver_id: req.query.receiver_id,
					// channal_id:'nil',
					message_text: req.query.message_text,
					// image_id:imageId.id

				})
			}
			
			res.send(putMsg)
		}
		else{
			res.send('No user available')
		}
	}
})

// Show Channal Messages by users
app.get('/getChannnalMsg', async(req,res) => {
	let getChannalDet = await Channal.findOne({where:{id:req.query.channal_id}})
	if (getChannalDet) {
		let getMsgs = await Message.findAll({where:{channal_id:req.query.channal_id}})
		let arr = []
		let msgLoop = await getMsgs.map(async(li) => {
			let hashDet = {}
			let getUserName = await User.findOne({where:{id:li.user_id},attributes:['name']})
			hashDet['id'] = li.id
			hashDet['userName'] = getUserName.name
			hashDet['message_text'] = li.message_text
			hashDet['time'] = li.createdAt
			if (li.image_id) {
				let getImg = await Image.findOne({where:{id: li.image_id},attributes:['name']})
				hashDet['image'] = getImg.name
			}
			arr.push(hashDet)
			
		})
		let responseLoop = await Promise.all(msgLoop);
		console.log('arr')
		console.log(arr)
		getChannalDet.dataValues['messages'] = arr.reverse(['id'])
		
		console.log('getChannalDet')
		console.log(getChannalDet)
		res.send(getChannalDet)
	}
	// res.send(getChannalDet)
})

// Show User Messages
app.get('/getUserMsg', async(req,res) => {
	console.log('getChannalDet')
	// console.log(`${req.query.user_id}`)
	if (req.query.receiver_id) {
		let checkUser = await User.findOne({where:{id: req.query.receiver_id}})
		if (checkUser) {
			let updateIsSeen = await Message.update({is_seen:1},{where:{user_id:req.query.receiver_id,receiver_id:req.query.user_id}})
			let getMsg = await Message.findAll({where:{user_id: req.query.user_id,receiver_id: req.query.receiver_id},channal_id:null})
			let getMsgrec = await Message.findAll({where:{user_id: req.query.receiver_id,receiver_id: req.query.user_id},channal_id:null})
			let result = getMsg.concat(getMsgrec)
			let arr = []
			let loopMsg = await result.map(async(li) => {
				let hashDet = {}
				let getUserName = await User.findOne({where:{id:li.user_id},attributes:['name']})
				hashDet['id'] = li.id
				hashDet['userName'] = getUserName.name
				hashDet['message_text'] = li.message_text
				hashDet['time'] = li.createdAt
				if (li.image_id) {
					let getImg = await Image.findOne({where:{id: li.image_id},attributes:['name']})
					hashDet['image'] = getImg.name
				}
				arr.push(hashDet)
			})
			let responseLoop = await Promise.all(loopMsg);
			res.send({messages: arr.reverse(['id'])})

			// if (getMsg.length === 0) {

			// 	res.send({status:false, detail: getMsg.reverse()})

			// }else{
			// 	res.send({status:true, detail: getMsg.reverse()})
			// }
		}else{
			res.send('No user available')
		}
	}else{
		res.send('Please provide receiver_id')
	}
})




app.post('/uploadfile', upload.single('image'), function(req, res) {
	console.log(req.file)
	res.send(req.file)
})






module.exports = app;