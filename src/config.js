module.exports = {
    mysql: {
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_NAME,
        host: process.env.INSTANCE_CONNECTION_NAME,
        port: process.env.DB_PORT
    },
    danbooru: {
        baseUrl: 'https://danbooru.donmai.us',
        apiPath: '/posts.xml',
    },
  };