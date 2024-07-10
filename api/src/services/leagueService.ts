import { TableResult } from '../../../shared/models/tableResult';
import envConfig from '../../../config/env'
import * as utils from '../../../shared/utils/utils';

import { DatabaseService } from '../../../shared/services/databaseService';

const databaseService = new DatabaseService();

export async function getTable(idLeague: number): Promise<TableResult[]> {
    let tableResult :TableResult[] = [];

    const league = await databaseService.getLeague(idLeague)

    if (league) {
        try {
            const browser = await utils.newBrowser();
            const page = await browser.newPage();
            const url = `${envConfig.domain}football/${league.location}/${league.name_format}/table/`
            await page.goto(url);
            await page.waitForSelector('tbody tr');
    
            const tableData = await page.evaluate(() => {
                const tableRows = Array.from(document.querySelectorAll('tbody tr'));
    
                return tableRows.map(row => {
    
                    let nameTeam = row.querySelector('.mg')?.textContent?.trim();
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
    
    }

    return tableResult;
}