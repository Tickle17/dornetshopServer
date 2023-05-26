const Items = require("./models/Items")

const getItem = (req,res) =>{
   Items.find()
   .then((items) => {
      const itemsObject = { items };
      res.json(itemsObject);
   })
   .catch((err) => {
      res.send(err)
      console.log(err);
   })};



module.exports = {getItem}