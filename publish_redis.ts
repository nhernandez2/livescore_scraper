import { createClient } from 'redis';

async function publishNotifyEvent() {
  const redisClient = createClient({
    url: 'redis://localhost:6379'
  });

  redisClient.on('error', (err) => console.log('Redis Client Error', err));

  await redisClient.connect();

  await redisClient.publish('notify', 'Este es un mensaje de prueba');

  console.log('Mensaje publicado en el canal notify');

  await redisClient.quit();
}

publishNotifyEvent();
