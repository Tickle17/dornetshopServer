const Router = require("express")
const router = new Router()
const controller = require("./getItemsController")
// создаем пути для аутентефикации
router.get("/items",controller.getItem)


module.exports = router