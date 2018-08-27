const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
var Schema = mongoose.Schema;
db.on('error',console.error.bind(console,'connection error:'));
db.once('open',()=>{
      console.log('connected to the database');
});

var UsersSchema = new Schema({
    id : String,
    name : String,
    currentroom : String 
});

var MessageSchema = new Schema({
      from : String,
      to : String,
      text : String,
      createdAt: Number
  });

var Users = mongoose.model('Users', UsersSchema);
var Messages = mongoose.model('Messages',MessageSchema);

function addUser (params,socid)
{
   db.collection('Users').insertOne({name : params.name,currentroom : params.room,id : socid });
};

function addMessage(msg)
{ 
    db.collection('Messages').insertOne({from : msg.from , to : msg.to, text : msg.text, createdAt : msg.createdAt });
}

async function searchById(socid)
{
  var i = await db.collection('Users').findOne({id : socid});
  return i.currentroom;
}

async function removeUser(socid)
{
   var k = await db.collection('Users').findOneAndDelete({id : socid});
   console.log(`${ k.value.name } is disconnected `);
}
// console.log('user1 name :' + user1.name);

module.exports = {addUser,removeUser,addMessage,searchById};