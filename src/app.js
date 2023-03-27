const express = require('express');
const mysql = require('mysql');
const dotenv = require("dotenv").config();
const axios = require('axios');
const config = require('./config');
const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;

app.get("/", async (req, res) =>{
    res.json({status: "API is Running and functioning"});
});

app.get('/art', async (req, res) => {
  try {
      const vtuber_name = req.query.name;
      // Get a connection from the MySQL connection pool
      const connection = await mysql.createConnection(config.mysql);
      // Execute a MySQL query to retrieve data
      const [rows] = await connection.query(
        'SELECT * FROM vtuber WHERE vtuber_name = ?',
        [vtuber_name]
      );
      const tags = rows.map((row)=> row.vtuber_name.toLowerCase().replace(/\s+/g, '_')).join(' ');
      // Release the MySQL connection back to the pool
      connection.release();

      const apiUrl = `${config.danbooru.baseUrl}${config.danbooru.apiPath}?tags=${tags}+rating:g&${req.url.split('?')[1]}`;

      const response = await axios.get(apiUrl);
      const xml = response.data
      // Send the XML response back to the client
      res.set('Content-Type', 'text/xml');
      res.send(xml);

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