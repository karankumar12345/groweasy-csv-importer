const express =require("express");
const cors=require("cors");
const cookieParser=require("cookie-parser");
const globalErrorHandler = require("./utils/globalerror");
const routes=require("./routes/index");
const app=express();


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.use("api/v1",routes);
app.use(globalErrorHandler)


module.exports=app;
