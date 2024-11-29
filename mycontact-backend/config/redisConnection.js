// const redis = require('redis');

// // Connect to Redis
// const redisClient = redis.createClient({
//     url: 'redis://127.0.0.1:6379', // Redis URL connection (default)
// });
// //redisClient.connect();
// (async () => {
//     try {
//       await redisClient.connect();
//       console.log('Connected to Redis');
//     } catch (error) {
//       console.error('Error connecting to Redis:', error);
//     }
//   })();

//   // Error handling for Redis
// redisClient.on('error', (err) => {
//   console.error('Redis Client Error:', err);
// });


// module.exports={
//     redisClient
// }