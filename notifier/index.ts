import { Server as SocketIOServer } from 'socket.io';
import 'dotenv/config'
import http from 'http';
import path from 'path';
import { createClient } from 'redis';
import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import redisClient from '../shared/utils/redis';
import { DatabaseService } from '../shared/services/databaseService';

const app = express();
const PORT_NOTIFIER = process.env.PORT_NOTIFIER || 3001;
const server = http.createServer(app);

const databaseService = new DatabaseService();

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Error up App');
});

const io = new SocketIOServer(server);

io.on('connection', (socket) => {
    socket.on('joinChannel', (userId) => {
      console.log(`Usuario ${userId} se ha unido al canal`);
      socket.join(userId);
    });
  
    socket.on('disconnect', () => {
      
    });
  });

redisClient.subscribe('notify', (message) => {
  io.emit('notify', message);
});

redisClient.subscribe('notify-next-matches', async (message) => {
  const matches = JSON.parse(message.toString());

  for (const match of matches) {
    const subscriptions = await databaseService.getAllSubscriptionToNotifyByTeam(match.id_team);

    const user_ids = subscriptions.map((subscription: any) => subscription.user_id);

    for (const user_id of user_ids) {
      io.to(`user/${user_id}`).emit('notify-next-matches', match); 
    }
  }
});

redisClient.subscribe('notify-livematch', async (message) => {
  const data = JSON.parse(message.toString());

  const subscriptions = await databaseService.getAllSubscriptionToNotifyByTeam(data.id_team);
  const user_ids = subscriptions.map((subscription: any) => subscription.user_id);

  for (const user_id of user_ids) {
    io.to(`user/${user_id}`).emit('notify-livematch', data.message); 
  }
});

server.listen(PORT_NOTIFIER, async () => {
    try {
      console.log(`Notifier server is running on http://localhost:${PORT_NOTIFIER}`);
    } catch (error) {
      console.error('Error connecting to database:', error);
      process.exit(1);
    }
});
