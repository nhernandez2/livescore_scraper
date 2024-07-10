import { MatchTeam, NextMatchDetails } from '../../shared/models/matchDetails';
import envConfig from '../../config/env'

import * as utils from '../../shared/utils/utils';
import { DatabaseService } from '../../shared/services/databaseService';
import { Subscription } from '../../shared/models/SubscriptionDTO';

const databaseService = new DatabaseService();

export async function getLastMatchs(subscription: Subscription): Promise<MatchTeam> {
    let lastMatches :MatchTeam = {
        lastMatchDetails: []
    };

    const idTeam = subscription.team_id;

    const team = await databaseService.getTeam(idTeam);
    team.name = team.name.replace(/\s+/g, '-').toLowerCase();

    let nextMatchDetails: NextMatchDetails = {
        idTeam: idTeam,
        homeTeamName: '',
        awayTeamName: '',
        dateDay: '',
        dayTime: '',
        statistics: [],
        urlNextMatch: ''
    }

    try {
        const browser = await utils.newBrowser();

        const page = await browser.newPage();

        const url = `${envConfig.domain}football/team/${team.name}/${team.external_id}/overview`
        await page.goto(url, {timeout: 30000, waitUntil: 'load'});

        const urlNextMatch = await utils.getLinkFromElement(page);

        const homeTeamName = await utils.getTextFromElement(page, '[data-testid="match-detail_team-name_home"]');
        const awayTeamName = await utils.getTextFromElement(page, '[data-testid="match-detail_team-name_away"]');
        const dateDay = await utils.getTextFromElement(page, '[id="SEV__status"]');
        const dayTime = await utils.getTextFromElement(page, '[id="score-or-time"]');

        const charDay = dayTime.charAt(dayTime.length - 1);
        const date = charDay === "'"  || dateDay === 'Half Time' || dayTime.includes('-') ? new Date() : utils.getDateFromString(dateDay, dayTime);

        nextMatchDetails = {
            idTeam,
            homeTeamName,
            awayTeamName,
            dateDay,
            dayTime,
            date,
            urlNextMatch,
        }

        await databaseService.saveNextMatch(nextMatchDetails);
        await browser.close();
    } catch(error) {
        console.error('Error scraping match: ', error);
    }

    return lastMatches;
}

export async function getStatsLiveMatch(urlNextMatch: string): Promise<{local: any[], visit: any[]}> {
    const browser = await utils.newBrowser();
    const page = await browser.newPage();
    const stats = await utils.getStats(page, urlNextMatch);
    await browser.close();
    return stats;
}