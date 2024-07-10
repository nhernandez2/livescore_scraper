import { Request, Response } from 'express';

import { getTable } from '../services/leagueService';

export async function getTableByLeague(req: Request, res: Response): Promise<void> {
    try {
        const id = parseInt(req.query.id as string, 10);
        const lastMatches = await getTable(id);

        res.status(200).json(lastMatches);
    } catch (error) {
        console.error('Error al obtener los ultimos partidos:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}