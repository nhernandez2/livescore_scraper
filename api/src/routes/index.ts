import express from 'express';
import livescoreRoutes from './liveScoreRoutes';
import subscriptionRoutes from './subscriptionRoutes';
import teamRoutes from './teamRoutes';
import leagueRoutes from './leagueRoutes';

const routerApi = express.Router();

routerApi.use('/livescore', livescoreRoutes);
routerApi.use('/subscription', subscriptionRoutes);
routerApi.use('/team', teamRoutes);
routerApi.use('/league', leagueRoutes);


export default routerApi;