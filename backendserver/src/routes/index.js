const express =require("express");
const router=express.Router();
const csvRoutes=require("./csv.routes");
const apiKeyMiddleware = require("../utils/apiKeyMiddleware");




router.use("/csv",apiKeyMiddleware,csvRoutes);

module.exports=router;