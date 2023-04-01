const express = require('express');
const mysql = require('mysql');
const dotenv = require("dotenv").config();
const axios = require('axios');
const config = require('./config');
const xml2js = require('xml2js');
const app = express();

app.use(express.json());
const port = process.env.PORT || 3000;
const url = process.env.URL;
app.get("/", async (req, res) =>{
    res.json({status: "API is Running and functioning"});
});

// Add headers before the routes are defined
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.get('/art', async function(req, res){
    const id = req.query.id;
    const connection = await mysql.createConnection(config.mysql);
    connection.on('error', function(err) {
      console.log(err.code);
    });
    connection.query('SELECT vtuber_name FROM vtuber WHERE vtuber_id = ?', [id], async (error, results) => {
      if(error){
          res.json({status: error});
      } else {
          const vtuber_name = results[0].vtuber_name;
          const tags = vtuber_name.replace(/\s+/g, '_');
          const apiUrl = `${config.danbooru.baseUrl}${config.danbooru.apiPath}?tags=${tags}+rating:g&page=${req.query.page || 1}&limit=${req.query.limit || 20}}`;
          // const apiUrl = `${config.danbooru.baseUrl}${config.danbooru.apiPath}?page=${req.query.page || 1}&tags=${tags}&limit=${req.query.limit || 20}+rating:g}`;
          const response = await axios.get(apiUrl);
          xml2js.parseString(response.data, (err, result) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error parsing XML response');
            } else {
              function buildUrl(url, param) {
                let paramParts = [];
                for (let key in param) {
                  if (Array.isArray(param[key])) {
                    paramParts.push(`${key}=${param[key].join(',')}`);
                  } else {
                    paramParts.push(`${key}=${param[key]}`);
                  }
                //   console.log(key);
                }
                // console.log(param)
                let finalUrl = url + '?' + paramParts.join('&');
                return finalUrl;
              }
              
              function createMetadata(url, page, param) {
                let metadata = {
                  'next_page': buildUrl(url, {...param, page: (+ req.query.page || 1) + 1, limit: (req.query.limit || 20)}),
                  'prev_page': null
                }
                if ((parseInt(page)-1) > 0) {
                  metadata['prev_page'] = buildUrl(url, {...param, page: (+ req.query.page || 1) - 1, limit: (req.query.limit || 20)});
                }
                return metadata;
            }

              const metadata = createMetadata(url+req.url.split('?')[0], (parseInt(req.query.page) || 1), req.query);
            // console.log(req.query)
              res.json({
                data:result.posts,
                meta:metadata
              });
            }
          });
      }   
   });
  });


// app.get('/art', async function(req, res){
//     const id = req.query.id;
//     const connection = await mysql.createConnection(config.mysql);
//     connection.query('SELECT vtuber_name FROM vtuber WHERE vtuber_id = ?', [id], async (error, results) => {
//       if(error){
//           res.json({status: error});
//       } else {
//           const vtuber_name = results[0].vtuber_name;
//           const tags = vtuber_name.replace(/\s+/g, '_');
//           const apiUrl = `${config.danbooru.baseUrl}${config.danbooru.apiPath}?page=1&tags=${tags}+rating:g}`;
//           const response = await axios.get(apiUrl);
//           xml2js.parseString(response.data, (err, result) => {
//             if (err) {
//                 console.error(err);
//                 res.status(500).send('Error parsing XML response');
//             } else {
//                 function buildUrl(url, param) {
//                     let paramParts = [];
//                     for (let key in param) {
//                       if (Array.isArray(param[key])) {
//                         paramParts.push(`${key}=${param[key].join(',')}`);
//                       } else {
//                         paramParts.push(`${key}=${param[key]}`);
//                       }
//                     }
//                     let finalUrl = url + '?' + paramParts.join('&');
//                     return finalUrl;
//                   }
                  
//                   function createMetadata(url, offset, limit, param) {
//                     let nextOffset = offset + limit;
//                     let prevOffset = offset - limit;
//                     let metadata = {
//                       'next_page': buildUrl(url, {...param, offset: nextOffset, limit}),
//                       'prev_page': null
//                     }
//                     if (prevOffset >= 0) {
//                       metadata['prev_page'] = buildUrl(url, {...param, offset: prevOffset, limit});
//                     }
//                     return metadata;
//                   }
//                 res.json({
//                     data:result.posts, 
//                     meta:metadata
//                 });
//             }
//         });
//       }   
//    });

//    meta: {
//     next page = "https://danbooru.donmai.us/posts.json?page=3&tags=gawr_gura+rating%3Ag"
//     prev page = "https://danbooru.donmai.us/posts.json?page=1&tags=gawr_gura+rating%3Ag"
//    } 
// });




app.listen(port, ()=> {
    console.log(`API listening on port ${port}`);
});


//https://danbooru.donmai.us/posts.xml?tags=gawr_gura+rating:g

//https://ourweb.com/art?name=gawr_gura&rating=g&ordersfbsd


// const pool = mysql.createPool({
//     user: process.env.DB_USER,
//     password: process.env.DB_PASS,
//     database: process.env.DB_NAME,
//     host: process.env.INSTANCE_CONNECTION_NAME,
//     port: process.env.DB_PORT
// });