const {Schema,model} = require("mongoose")

const Items = new Schema({
   id:{type:Number,required:true},
   name:{type:String, required:true},
   description:{type:String, required:true},
   price:{type:Number, required:true},
   image:{type:String, required:true}

},{collection:"items"})

module.exports = model("Items",Items)