import cron from 'node-cron';
import 'dotenv/config'
import redisClient from '../shared/utils/redis';
import { getLastMatchs, getStatsLiveMatch } from './services/scrapperService';
import { Subscription } from '../shared/models/SubscriptionDTO';
import { DatabaseService } from '../shared/services/databaseService';

const databaseService = new DatabaseService();

const subscriptions = async () => {
  const subscriptions = await databaseService.getAllSubscription();
  try {
    for (const subscription of subscriptions) {
      await getLastMatchs(subscription)
    };
  } catch (error) {
    console.error('Error running subscriptions:', error);
  }
};

const nextMatches = async () => {
  const matches = await databaseService.getNextMatchesUpcoming();
  try {
    if (matches.length > 0) {
      await redisClient.publish('notify-next-matches', JSON.stringify(matches));
      await databaseService.setNotificationSent(matches);
    }
  } catch (error) {
    console.error('Error running nextMatches:', error);
  }
};

const liveMatches = async () => {
  const matches = await databaseService.getNextMatchesCurrentDay();
  try {
    for (const match of matches) {
      const cacheKey = `liveMatch:${match.id}`;
      const cachedValue = await redisClient.get(cacheKey);
      const stats = await getStatsLiveMatch(match.url);
      const statsJson = JSON.stringify(stats);
      if (cachedValue) {
        const lastMatchesCache = JSON.parse(cachedValue);
        lastMatchesCache['local'].pop()
        const cacheTest = JSON.stringify(lastMatchesCache);

        if (cacheTest != statsJson) {

          const lastLocalEvent = stats.local[stats.local.length - 1];
          const lastVisitEvent = stats.visit[stats.visit.length - 1];
          const minutoLocal = parseInt(lastLocalEvent.minute.match(/\d+/g)[0]);
          const minutoVisita = parseInt(lastLocalEvent.minute.match(/\d+/g)[0]);

          let message = '';
          let matchString = `${match.home_team} vs ${match.away_team}`;
          if (minutoLocal > minutoVisita) {
            if ('goalHome' in lastLocalEvent) {
              message = `${matchString}, -- ${lastLocalEvent.current_result} --, minuto ${lastLocalEvent.minute} gol de ${lastLocalEvent.goalHome}`
            }
            if ('doubleRedHome' in lastLocalEvent) {
              message = `${matchString}, minuto ${lastLocalEvent.minute} Doble tarjeta amarilla para ${lastLocalEvent.doubleRedHome}`
            }
            if ('redHome' in lastLocalEvent) {
              message = `${matchString}, minuto ${lastLocalEvent.minute} Tarjeta roja para ${lastLocalEvent.redHome}`
            }
            if ('yellowHome' in lastLocalEvent) {
              message = `${matchString}, minuto ${lastLocalEvent.minute} Tarjeta amarilla para ${lastLocalEvent.yellowHome}`
            }
            if ('ownGoalHome' in lastLocalEvent) {
              message = `${matchString}, -- ${lastLocalEvent.current_result} --, minuto ${lastLocalEvent.minute} Auto-gol de ${lastLocalEvent.ownGoalHome}`
            }
          } else {
            if ('goalVisit' in lastVisitEvent) {
              message = `${matchString}, -- ${lastVisitEvent.current_result} --, minuto ${lastVisitEvent.minute} gol de ${lastVisitEvent.goalVisit}`
            }
            if ('doubleRedVisit' in lastVisitEvent) {
              message = `${matchString}, minuto ${lastVisitEvent.minute} doble tarjeta amarilla para ${lastVisitEvent.doubleRedVisit}`
            }
            if ('redVisit' in lastVisitEvent) {
              message = `${matchString}, minuto ${lastVisitEvent.minute} Tarjeta roja para ${lastVisitEvent.redVisit}`
            }
            if ('yellowVisit' in lastVisitEvent) {
              message = `${matchString}, minuto ${lastVisitEvent.minute} Tarjeta amarilla para ${lastVisitEvent.yellowVisit}`
            }
            if ('ownGoalVisit' in lastVisitEvent) {
              message = `${matchString}, -- ${lastVisitEvent.current_result} --, minuto ${lastVisitEvent.minute} Auto-gol de ${lastVisitEvent.ownGoalVisit}`
            }
            await redisClient.publish('notify-livematch', JSON.stringify({ message: message, id_team: match.id_team }));
          }
        } else {
          continue;
        }
      }

      await redisClient.set(cacheKey, statsJson);
    };
  } catch (error) {
    console.error('Error running liveMatches:', error);
  }
}

const CRON_SUBSCRIPTION = process.env.CRON_SUBSCRIPTION || '0 6 * * *';
const CRON_NEXT_MATCH = process.env.CRON_NEXT_MATCH || '*/30 * * * *';
const CRON_LIVE_MATCH = process.env.CRON_LIVE_MATCH || '*/1 * * * *';

cron.schedule(CRON_SUBSCRIPTION, subscriptions);
cron.schedule(CRON_NEXT_MATCH, nextMatches);
cron.schedule(CRON_LIVE_MATCH, liveMatches);

console.log(`Task subscriptions scheduled: ${CRON_SUBSCRIPTION}`);
console.log(`Task next matches scheduled: ${CRON_NEXT_MATCH}`);
console.log(`Task live matches scheduled: ${CRON_LIVE_MATCH}`);
