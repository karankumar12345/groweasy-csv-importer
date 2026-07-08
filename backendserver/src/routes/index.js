const express =require("express");
const router=express.Router();
const csvRoutes=require("./csv.routes");




router.use("/csv",csvRoutes);

module.exports=router;