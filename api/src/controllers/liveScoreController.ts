import { Request, Response } from 'express';
import { LiveScoreService } from '../services/liveScoreService';

const livescoreService = new LiveScoreService();


export async function searchTeams(req: Request, res: Response): Promise<void> {
    try {
        const { query } = req.query;

        if (!query) {
            res.status(400).json({ error: 'Se requiere el parámetro de busqueda' });
            return;
        }
        
        const teams = await livescoreService.searchTeam(query as string);

        res.status(200).json(teams);
    } catch (error) {
        console.error('Error al obtener teams:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export async function searchLeague(req: Request, res: Response): Promise<void> {
    try {
        const { query } = req.query;

        if (!query) {
            res.status(400).json({ error: 'Se requiere el parámetro de busqueda' });
            return;
        }
        const teams = await livescoreService.searchLeague(query as string);

        res.status(200).json(teams);
    } catch (error) {
        console.error('Error al obtener ligas:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}