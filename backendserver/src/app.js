const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./utils/globalerror");
const routes = require("./routes/index");
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "GrowEasy CSV Importer API is running" });
});

app.use("/api/v1", routes);
app.use(globalErrorHandler)


module.exports=app;
