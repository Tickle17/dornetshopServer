const User = require("./models/User")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const {secret} = require("./config")

const generateAccessToken = (id,roles)=>{
   const payload = {
      id,
      roles
   }
   return jwt.sign(payload,secret, {expiresIn:"24h" })
}

// middleware in progress
// async function authMiddleware(req, res, next) {
//    try {
//       const { username } = req.body;
//       const candidate = await User.findOne({ username });
//       if (!candidate) {
//          console.log(`Попытка проверки пользователя`);
//          return res.status(400).json({ message: "необходима авторизация" });
//       }
//       next()
//    } catch (err) {
//       res.status(400).json({ message: "check middleware error" });
//    }
// }

class authController{
   // Регистрация пользователя
   async registration(req,res){
      try{
         const {username,password} = req.body
         const candidate = await User.findOne({username})
         if (candidate){
            return res.status(400).json({message:"есть такой уже чел"})
         }
         const hash = bcrypt.hashSync(password,6)
         const user = new User({username,password:hash,token:"some"})
         await user.save()
         const token = generateAccessToken(user._id,user.username)
         await User.updateOne({username},{$set:{token:token}})
         await user.save()
         const datas = await User.findOne({username})
         return res.json({message:`зарегался, харош`,username:datas.username, token:datas.token})
      }
      catch (err){
         console.log(err)
         res.status(400).json({message:"reg error"})
      }
   }

   // Логирование пользователя
   async login(req,res){
      try{
         const {username,password} = req.body
         const candidate = await User.findOne({username})
         if (!candidate){
            return res.status(400).json({message:"неверный логин"})
         }
         const isMatch = bcrypt.compareSync(password, candidate.password);
         if(!isMatch){
            console.log(`${candidate.username} попытка входа`)
            return res.status(400).json({message:"Неверный пароль"})

         }
         if (isMatch){
            console.log(`${candidate.username} login successful`)
            return res.json({message:`залогинился, харош`,username:candidate.username, token:candidate.token})
         }
      }
      catch (err){
         res.status(400).json({message:"login error"})
      }
   }
   // Проверка аутентефикации пользователя
   async checkUser(req,res){
      try{
         const {username,token} = req.body
         const candidate = await User.findOne({username})
         if (!candidate){
            console.log(`Попытка проверки пользователя`)
            return res.status(400).json({message:"необходима авторизация"})
         }
         else if (candidate){
            if (candidate.token = token){
               return res.json({message:"access"})
            }
            return res.status(400).json({message:"необходима повторная авторизация"})
         }
      }
      catch (err){
         res.status(400).json({message:"checkUser error"})

      }
   }
   // Информация о юзере на странице профиля
   async profileInfo(req,res){
      try{
         const {username} = req.body
         const candidate = await User.findOne({username})
         return res.json({message:"access",balance:candidate.balance,firstname:candidate.firstName,secondname:candidate.secondName,orders:candidate.orders})
         }
      catch (err){
         res.status(400).json({message:"check error"})
      }
   }

   // обновляем информацию пользователя
   async updateProfileUser(req, res) {
      try {
         const { username, firstName: firstNameInput, secondName: secondNameInput } = req.body;
         const updatedUser = await User.findOneAndUpdate({ username }, { firstName: firstNameInput, secondName: secondNameInput }, { new: true });
         return res.json({ message: "access", balance: updatedUser.balance, firstName: updatedUser.firstName, secondName: updatedUser.secondName });
      } catch (error) {
         console.log(error);
         return res.status(500).json({ message: "Ошибка сервера" });
      }
   }
   // Обновление корзины пользователя, при добавлении в нее товаров
   async updateBusket(req, res) {
      try {
         const { username, name,price,photo,description } = req.body;
         console.log(username, name,price,photo,description)
         const user = await User.findOne({ username });

         if (user) {
            user.basket = [...user.basket, { name,price,photo,description }];
            res.json({message:"success"})
            await user.save();
         } else {
            return res.json({message:"необходима регистрация"})
         }
      } catch (e) {
         console.log(e);
         return res.status(500).json({ message: "Ошибка сервера" });
      }
   }

   // Создание ордера по корзине
   async acceptBuyBasket(req, res) {
      try {
         const { username, basket, total } = req.body;
         console.log(basket,total)
         const user = await User.findOne({ username });

         if (user) {
            if(user.balance<total){
               return res.json({message:"Недостаточно средств"})
            }
            user.orders=[...user.orders,basket]
            await user.save();
            return res.json({message:"access"})
         } else {
            return res.json({message:"необходима регистрация"})
         }
      } catch (e) {
         console.log(e);
         return res.status(500).json({ message: "Ошибка сервера при покупук" });
      }
   }
   // УДаление корзины
   async deleteBusket(req, res) {
      try {
         const { username } = req.body;
         const user = await User.findOne({ username });

         if (user) {
            user.basket = [];
            await user.save();
            res.status(200).json({ message: 'Корзина успешно удалена' });

         } else {
            return res.json({message:"необходима регистрация"})
         }
      } catch (e) {
         console.log(e);
      }
   }
   // Удаление предмета в корзине
   async deleteItemBusket(req, res) {
      const { username, itemId } = req.body;
      console.log(itemId);
      try {
         const user = await User.findOne({username});

         if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
         }

         // Удаление элемента из массива корзины
         user.basket = user.basket.filter(item => item._id.toString() !== itemId);

         // Сохранение изменений в базе данных
         await user.save();

         res.status(200).json({ message: 'Элемент корзины успешно удален' });
      } catch (error) {
         console.error(error);
         res.status(500).json({ message: 'Произошла ошибка при удалении элемента корзины' });
      }
   }
   //Информация о корзине
   async basket(req, res) {
      try {
         const { username } = req.body;
         const user = await User.findOne({ username });

         if (user.basket.length < 1) {
            res.json({message:"ничего в корзине нет"})
         } else {
            res.json({message:"access",basket:user.basket})
         }
      } catch (e) {
         console.log(e);
         return res.status(500).json({ message: "Ошибка корзины" });

      }
   }
}




module.exports = { authController: new authController() };
