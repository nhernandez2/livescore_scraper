import { TableResult } from '../../../shared/models/tableResult';
import { MatchTeam, LastMatchDetails } from '../../../shared/models/matchDetails';
import envConfig from '../../../config/env'

import * as utils from '../../../shared/utils/utils';
import { DatabaseService } from '../../../shared/services/databaseService';

const databaseService = new DatabaseService();


export async function getLastMatchs(idTeam: number): Promise<MatchTeam> {
    let lastMatches :MatchTeam = {
        lastMatchDetails: []
    };

    const team = await databaseService.getTeam(idTeam);

    if (team) {
        try {   
            const browser = await utils.newBrowser();
            const page = await browser.newPage();
            const url = `${envConfig.domain}football/team/${team.name}/${team.external_id}/overview`

            await page.goto(url);
            
            const elements = await page.$$('.do, .ho');;
    
            for (let element of elements) {
                const homeTeamName = await utils.getTextContent(element, '[id="undefined__home-team-name"]');
                const awayTeamName = await utils.getTextContent(element, '[id="undefined__away-team-name"]');
                const homeTeamScore = await utils.getTextContent(element, '[id="undefined__home-team-score"]');
                const awayTeamScore = await utils.getTextContent(element, '[id="undefined__away-team-score"]');
                let status = await utils.getTextContent(element, '[id="undefined__status-or-time"]');
                const urlStats = await utils.getHrefAttribute(page, element, 'a');
                const resultMatch = `${homeTeamScore} - ${awayTeamScore}`;
    
                status = status === 'FT' ? 'Finalizado' : status === 'Postp.' ? 'Pospuesto' : '';
    
                const matchDetail: LastMatchDetails = {
                    idTeam,
                    homeTeamName,
                    awayTeamName,
                    resultMatch,
                    status,
                    urlStats
                };
    
                lastMatches.lastMatchDetails.push(matchDetail);
            }
    
            try {
                for (let matchObj of lastMatches.lastMatchDetails) {
                    matchObj.statistics = await utils.getStats(page, matchObj.urlStats);
                    delete matchObj.urlStats;
                }        
                
            } catch (error) {
                console.error('Error scraping match statistics: ', error);
            } finally {
                await browser.close();
            }
    
        } catch(error) {
            console.error('Error scraping match: ', error);
        }
    }
    return lastMatches;
}

export async function getTable(location: string, leagueName: string): Promise<TableResult[]> {
    let tableResult :TableResult[] = [];

    try {
        const browser = await utils.newBrowser();
        const page = await browser.newPage();
        const url = `${envConfig.domain}football/${location}/${leagueName}/table/`
        await page.goto(url);
        await page.waitForSelector('tbody tr');

        const tableData = await page.evaluate(() => {
            const tableRows = Array.from(document.querySelectorAll('tbody tr'));

            return tableRows.map(row => {

                let nameTeam = row.querySelector('.Ge')?.textContent?.trim();
                nameTeam = nameTeam?.replace(/'/g, "\\'");
                const regex = /^(\d+)/;

                let position = '';
                let positionString = row.querySelector(`[id='${nameTeam}__league-column__position']`)?.textContent?.trim();
                const matches = positionString?.match(regex);
                if (matches && matches.length > 0) {
                    position = matches[0]
                }

                const teamName = row.querySelector(`[id='${nameTeam}__league-column__name']`)?.textContent?.trim();
                const played = row.querySelector(`[id='${nameTeam}__league-column__played']`)?.textContent?.trim();
                const wins = row.querySelector(`[id='${nameTeam}__league-column__wins']`)?.textContent?.trim();
                const drawn = row.querySelector(`[id='${nameTeam}__league-column__draws']`)?.textContent?.trim();
                const losses = row.querySelector(`[id='${nameTeam}__league-column__losses']`)?.textContent?.trim();
                const goalsFor = row.querySelector(`[id='${nameTeam}__league-column__goalsFor']`)?.textContent?.trim();
                const goalsAgainst = row.querySelector(`[id='${nameTeam}__league-column__goalsAgainst']`)?.textContent?.trim();
                const goalsDiff = row.querySelector(`[id='${nameTeam}__league-column__goalsDiff']`)?.textContent?.trim();
                const points = row.querySelector(`[id='${nameTeam}__league-column__points']`)?.textContent?.trim();

                return {
                    position,
                    teamName,
                    played,
                    wins,
                    drawn,
                    losses,
                    goalsFor,
                    goalsAgainst,
                    goalsDiff,
                    points,
                };
            });
        });

        tableResult = tableData;

        await browser.close();
    } catch (error) {
        console.error('Error scraping table: ', error);
    }

    return tableResult;
}