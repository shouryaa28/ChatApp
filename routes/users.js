const mongoose=require('mongoose')
mongoose.connect('mongodb://localhost/chat')

var chatSchema=mongoose.Schema({
  msg:String,
  created:{
    type:Date,
    default:Date.now
  }
})

module.exports=mongoose.model('message',chatSchema)