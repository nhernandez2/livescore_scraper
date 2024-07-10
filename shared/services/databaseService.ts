import { TeamDTO } from '../models/TeamDTO';
import { LeagueDTO  } from '../models/LeagueDTO';
import { Subscription } from '../models/SubscriptionDTO';
import db from '../utils/db';

export class DatabaseService {

    public async getTeam(id: number): Promise<TeamDTO> {
        try {
            const selectSql = 'SELECT * FROM Team WHERE id = ?';
            const resultSelect = await db.query(selectSql, [id]);
            return TeamDTO.fromDbResult(resultSelect[0]);
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async getLeague(id: number): Promise<LeagueDTO> {
        try {
            const selectSql = 'SELECT * FROM League WHERE id = ?';
            const resultSelect = await db.query(selectSql, [id]);
            return LeagueDTO.fromDbResult(resultSelect[0]);
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }


    public async getTeamFromExternalId(externalId: string): Promise<TeamDTO> {
        try {
            const selectSql = 'SELECT * FROM Team WHERE external_id = ?';
            const resultSelect = await db.query(selectSql, [externalId]);
            return TeamDTO.fromDbResult(resultSelect[0]);
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async getLeagueFromExternalId(externalId: string): Promise<LeagueDTO> {
        try {
            const selectSql = 'SELECT * FROM League WHERE external_id = ?';
            const resultSelect = await db.query(selectSql, [externalId]);
            return LeagueDTO.fromDbResult(resultSelect[0]);
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }


    public async saveTeam(team: any): Promise<TeamDTO> {
        try {
            const insert = `
                INSERT INTO Team (external_id, name, location)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                location = VALUES(location)`;

            await db.query(insert, [team.ID, team.Nm, team.CoNm]);
            const result = await this.getTeamFromExternalId(team.ID);
            return result;
        } catch (error) {
        throw new Error(`Error executing query: ${error}`);
        }
    }

    public async saveLeague(team: any): Promise<LeagueDTO> {
        try {
            const insert = `
                INSERT INTO League (external_id, name, name_format, location)
                VALUES (?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                name = VALUES(name),
                name_format = VALUES(name_format),
                location = VALUES(location)`;

            await db.query(insert, [team.Sid, team.Snm, team.Scd, team.Ccd]);
            const result = await this.getLeagueFromExternalId(team.Sid);
            return result;
        } catch (error) {
        throw new Error(`Error executing query: ${error}`);
        }
    }

    public async saveNextMatch(nextMatch: any): Promise<void> {
        try {
            const insert = `
                INSERT INTO NextMatchDetails (home_team_name, away_team_name, date_day, day_time, date_time, url_next_match, id_team)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                home_team_name = VALUES(home_team_name),
                away_team_name = VALUES(away_team_name),
                date_day = VALUES(date_day),
                day_time = VALUES(day_time),
                date_time = VALUES(date_time),
                url_next_match = VALUES(url_next_match),
                id_team = VALUES(id_team)`;

            await db.query(insert, [
                nextMatch.homeTeamName, 
                nextMatch.awayTeamName,
                nextMatch.dateDay,
                nextMatch.dayTime,
                nextMatch.date,
                nextMatch.urlNextMatch,
                nextMatch.idTeam
            ]);
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async saveSubscription(subs: any): Promise<any> {
        try {
            const insert = `
                INSERT INTO Subscription (team_id, usuario_id)
                VALUES (?, ?)
                ON DUPLICATE KEY UPDATE
                team_id = VALUES(team_id),
                usuario_id = VALUES(usuario_id)`;

            const result = await db.query(insert, [subs.team_id, subs.usuario_id]);
            return result.insertId;
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async getNextMatchesCurrentDay(): Promise<any> {
        try {
            const results = await db.query(`
                SELECT *
                FROM NextMatchDetails
                WHERE date_time <= NOW()
                AND date_time >= DATE_SUB(NOW(), INTERVAL 2 HOUR)`
            );
            const urls = results.map((result: any) => ({
                id: result.id,
                url: result.url_next_match,
                id_team: result.id_team,
                home_team: result.home_team_name,
                away_team: result.away_team_name
            }));
            return urls;
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async getNextMatchesUpcoming(): Promise<any> {
        try {
            const results = await db.query(`
                SELECT id, date_time, home_team_name, away_team_name, id_team
                FROM NextMatchDetails
                WHERE date_time BETWEEN NOW() AND (NOW() + INTERVAL 30 MINUTE) AND notified = 0`
            );
            return results;
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async getAllSubscription(): Promise<any> {
        try {
            const results = await db.query('SELECT * FROM Subscription');
            const subscriptions: Subscription[] = results.map((row: any) => ({
                id: row.id,
                team_id: row.team_id,
                user_id: row.usuario_id
            }));
            return subscriptions;
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async getAllSubscriptionToNotifyByTeam(id_team: number): Promise<any> {
        try {
            const results = await db.query('SELECT * FROM Subscription Where team_id = ?', [id_team]);
            const subscriptions: Subscription[] = results.map((row: any) => ({
                id: row.id,
                team_id: row.team_id,
                user_id: row.usuario_id
            }));
            return subscriptions;
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }

    public async setNotificationSent(matches: any[]): Promise<void> {
        try {     
            const ids = matches.map((match: any) => match.id);      
            const placeholders = ids.map(() => '?').join(',');
            await db.query(`UPDATE NextMatchDetails SET notified = 1 WHERE id IN (${placeholders})`, ids);
        } catch (error) {
            throw new Error(`Error executing query: ${error}`);
        }
    }
}
