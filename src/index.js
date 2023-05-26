const express = require('express')
const cors = require('cors')
const mongoose = require("mongoose");
const https = require('https');
const fs = require('fs');
const PORT = process.env.PORT || 5001
const URL = process.env.URL
const authRouter = require("./authRouter")
const getItemsRouter = require("./getItemsRouter")

const app = express() //используем фреймворк для REST API
app.use(express.json()) // учим фреймворк читать JSON
app.use(cors()) // отключаем политику CORS, для получения запросов
app.use("/auth",authRouter) //создаем путь для запросов
app.use("/items",getItemsRouter) //создаем путь для запросов

const options = {
   key: fs.readFileSync('/site/private.key'),
   cert: fs.readFileSync('/site/public.crt')
};

const start = async () => {
   const db = mongoose.connect(URL)
   try {
      await db
      https.createServer(options, app).listen(PORT, ()=> console.log(`server started on ${PORT}`));
   } catch (e) {
      console.log(e)
   }
}

start()

// const express = require('express')
// const cors = require('cors')
// const mongoose = require("mongoose");
// const PORT = process.env.PORT || 5001
// const URL = process.env.URL

// const authRouter = require("./authRouter")
// const getItemsRouter = require("./getItemsRouter")
//
//
//
// const app = express() //используем фреймворк для REST API
// app.use(express.json()) // учим фреймворк читать JSON
// app.use(cors()) // отключаем политику CORS, для получения запросов
// app.use("/auth",authRouter) //создаем путь для запросов
// app.use("/items",getItemsRouter) //создаем путь для запросов
//
// const start = async () => {
//    const db = mongoose.connect(URL)
//    try{
//       await db
//       app.listen(PORT, ()=> console.log(`server started on ${PORT}`))
//    } catch (e){
//       console.log(e)
//    }
// }
//
// start()