const { Schema, model } = require("mongoose");

const BasketItemSchema = new Schema({
   name:{type:String, required:true},
   description:{type:String, required:true},
   price:{type:Number, required:true},
   photo:{type:String, required:true},
   // quantity:{type:Number, required:true},
   createdAt: { type: Date, default: Date.now }
});


const User = new Schema({
   username: { type: String, unique: true, required: true },
   password: { type: String, required: true },
   token: { type: String, required: true },
   firstName: { type: String, default: "Установите имя" },
   secondName: { type: String, default: "Установите фамилию" },
   balance: { type: Number, default: 1000 },
   basket: [BasketItemSchema],
   orders:[[BasketItemSchema]]
}, { collection: "users", timestamps: true  });

module.exports = model("User", User);