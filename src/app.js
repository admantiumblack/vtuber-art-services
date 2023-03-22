const express = require('express');
const mysql = require('mysql');
const dotenv = require("dotenv").config();
const app = express();
const PORT = 3000;

app.use(express.json());
const port = process.env.PORT || 8080;
app.listen(port, ()=> {
    console.log(`API listening on port ${port}`);
});

app.get("/", async (req, res) =>{
    res.json({status: "API is Running and functioning"});
});

// app.listen(PORT, function (err) {
//     if (err) console.log(err);
//     console.log("Server listening on PORT", PORT);
// });

// const pool = mysql.createPool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     host: process.env.INSTANCE_CONNECTION_NAME,
//     port: process.env.DB_PORT
// });