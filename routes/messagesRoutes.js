const { addMessage, getAllMessage } = require("../controllers/messagesController");
const router=require("express").Router()

router.post("/addMessage/",addMessage)
router.post("/getAllMessage/",getAllMessage)



module.exports=router;