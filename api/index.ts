import express, { Request, Response, NextFunction } from 'express';
import bodyParser from 'body-parser';
import envConfig from '../config/env';
import routerApi from '../api/src/routes'
import db from '../shared/utils/db';

const app = express();
const PORT = envConfig.port;

app.use(bodyParser.json());

app.use('/api', routerApi);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Error up App');
});


app.listen(PORT, async () => {
    try {
      await db.query('SELECT 1');
      console.log('Connection DB ok');
      console.log(`Server is running on http://localhost:${PORT}`);
    } catch (error) {
      console.error('Error connecting to database:', error);
      process.exit(1);
    }
});