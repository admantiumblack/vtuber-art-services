const express = require('express');
const mysql = require('mysql');
const dotenv = require("dotenv").config();
const axios = require('axios');
const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", async (req, res) =>{
    res.json({status: "API is Running and functioning"});
});

app.get('/art', async (req, res) => {
    const { vtuber_name } = req.query;
    try {
        // Get a connection from the MySQL connection pool
        const connection = await pool.promise().getConnection();
        // Execute a MySQL query to retrieve data
        const [rows, fields] = await connection.query(
          'SELECT * FROM vtuber WHERE vtuber_name = ?',
          [vtuber_name]
        );
        // Release the MySQL connection back to the pool
        connection.release();

        const apiUrl = `https://danbooru.donmai.us/posts.xml?tags=${rows[0].vtuber_name}+rating:g`;


        const response = await axios.get(apiUrl);
        // Send the XML response back to the client
        res.set('Content-Type', 'text/xml');
        res.send(response.data);
    } catch (error) {
      console.error(error);
      res.status(500).send('Internal server error');
    }
});


app.listen(port, ()=> {
    console.log(`API listening on port ${port}`);
});


//https://danbooru.donmai.us/posts.xml?tags=gawr_gura+rating:g

//https://ourweb.com/art?name=gawr_gura&rating=g&ordersfbsd

// app.listen(PORT, function (err) {
//     if (err) console.log(err);
//     console.log("Server listening on PORT", PORT);
// });


// app.get("/art", async (req, res) =>{
//     res.json({status: "API is Running and functioning"});
// });

// const pool = mysql.createPool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     host: process.env.INSTANCE_CONNECTION_NAME,
//     port: process.env.DB_PORT
// });