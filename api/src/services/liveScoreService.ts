import axios, { AxiosInstance, AxiosResponse } from 'axios';
import envConfig from '../../../config/env';
import { LeagueDTO } from '../../../shared/models/LeagueDTO';
import { TeamDTO } from '../../../shared/models/TeamDTO';
import { DatabaseService } from '../../../shared/services/databaseService';

const databaseService = new DatabaseService();

export class LiveScoreService {
    private axiosInstance: AxiosInstance;
    

    constructor() {
        this.axiosInstance = axios.create({
            baseURL: envConfig.base_api_livescore,
        });

    }

    async searchTeam(query: string): Promise<TeamDTO[]> {
        let searchTeam: TeamDTO[] = [];
        try {
            const response = await this.axiosInstance.get(`${envConfig.api_search}?query=${query}&limit=10&teams=true`);
            if (response.status === 200) {
                if (response.data && response.data.Teams) {
                    const teamPromises = response.data.Teams.map(async (team: any) => {
                        const teamDTO = await databaseService.saveTeam(team);
                        return teamDTO.toJSONWithoutExternalId();
                    });
                    searchTeam = await Promise.all(teamPromises);
                }
            } else {
                throw new Error(`Error al buscar teams: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al consumir el servicio:', error);
            throw error;
        }
        return searchTeam;
    }

    async searchLeague(query: string): Promise<LeagueDTO[]> {
        let searchLeague: LeagueDTO[] = [];
        try {
            const response = await this.axiosInstance.get(`${envConfig.api_search}?query=${query}&limit=10&stages=true`);
            if (response.status === 200) {
                if (response.data && response.data.Stages) {
                    const leaguePromises = response.data.Stages.map(async (league: any) => {
                        const leagueDTO = await databaseService.saveLeague(league);
                        return leagueDTO.toJSONWithoutExternalId();
                    });
                    searchLeague = await Promise.all(leaguePromises);
                }
            } else {
                throw new Error(`Error al buscar ligas:  ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error al consumir el servicio:', error);
            throw error;
        }
        return searchLeague;
    }
}