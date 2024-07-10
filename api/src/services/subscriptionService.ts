import { DatabaseService } from '../../../shared/services/databaseService';
import { TeamDTO } from '../../../shared/models/TeamDTO';

const databaseService = new DatabaseService();

export class SubscriptionService {

    async subscription(idTeam: number, userId: string): Promise<TeamDTO> {
        try {
            let team = await databaseService.getTeam(idTeam)
            if (team) {
                await databaseService.saveSubscription({team_id: idTeam, usuario_id: userId});
            }
            return team;
        } catch (err) {
            throw new Error(`Error executing query: ${err}`);
        }
    }
}