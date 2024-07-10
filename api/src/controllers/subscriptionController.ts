import { Request, Response } from 'express';
import { SubscriptionService } from '../services/subscriptionService';

const subscriptionService = new SubscriptionService();

export async function subscriptionTeam(req: Request, res: Response): Promise<void> {
    const teamId = req.body.id as number;
    const userId = req.headers.user_id as string;
    const team = await subscriptionService.subscription(teamId, userId);
    if (team.id != 0) {
        res.status(200).json(`Suscrito correctamente al equipo ${team.name}`);
    } else {
        res.status(500).json({ error: 'Internal Server Error' });
    }

}