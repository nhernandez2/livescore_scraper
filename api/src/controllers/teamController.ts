import { Request, Response } from 'express';
import redisClient from '../../../shared/utils/redis';

import { getLastMatchs } from '../services/teamService';


export async function getLastMatchByTeam(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.query.id as string, 10);

        const cacheKey = `lastMatches:${id}`;
        const cachedValue = await redisClient.get(cacheKey);

        if (cachedValue) {
            const lastMatches = JSON.parse(cachedValue);
            res.status(200).json(lastMatches);
        } else {
            const lastMatches = await getLastMatchs(id);
            await redisClient.set(cacheKey, JSON.stringify(lastMatches), {EX: 60*2});
            res.status(200).json(lastMatches);
        }
    } catch (error) {
        console.error('Error al obtener los ultimos partidos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}