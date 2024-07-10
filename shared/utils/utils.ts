import * as puppeteer from 'puppeteer';
import { parse, format} from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
import { DateTime } from 'luxon';
import envConfig from '../../config/env'

export async function getTextContent(element: any, selector: string): Promise<string> {
    const elHtml = await element.$(selector);
    return elHtml ? elHtml.evaluate((el: any) => el.textContent?.trim()) : '';
}

export async function getHrefAttribute(page: puppeteer.Page, element: any, selector: string): Promise<string> {
    const elHtml = await element.$(selector);
    return elHtml ? page.evaluate(el => el.getAttribute('href'), elHtml) : '';
}

export async function getTextFromElement(page: puppeteer.Page, selector: string): Promise<string> {
    const element = await page.waitForSelector(selector);
    return element? await page.evaluate((el: any) => el.textContent.trim(), element) : '';
}

export async function getLinkFromElement(page: puppeteer.Page): Promise<string> {
    const linkDetailtElement = await page.$('a.ch');
    return linkDetailtElement? await page.evaluate((el: any) => el.getAttribute('href'), linkDetailtElement) : '';
}

export function getRealDateString(fecha: string): string {
    const today: Date = new Date();
    fecha = fecha === 'Today' ? format(today, 'dd MMM') : fecha;
    return fecha;
}

export function getDateFromString(fechaString: string, horaString: string): Date {
    fechaString = getRealDateString(fechaString);
    const fechaHoraString = `${fechaString} ${horaString}`;
    
    try {
        const formatString = 'dd-MM-yyyy HH:mm';
        const fecha = parse(fechaHoraString, 'dd MMM HH:mm', new Date());
        const formatStringDate = formatInTimeZone(fecha, 'America/Santiago', formatString);
        const dtLocal = DateTime.fromFormat(formatStringDate, "dd-MM-yyyy HH:mm", { zone: 'America/Santiago' });
        const fechaHoraDate = dtLocal.toJSDate();
        return fechaHoraDate;
    } catch (error) {
        console.error('Error al analizar la fecha:', error);
        return new Date();
    }
}

export function isRunningInDocker() {
    return process.env.IS_DOCKER == 'true';
};

export async function newBrowser(): Promise<any> {
    if (isRunningInDocker()) {
        return puppeteer.launch({
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--single-process',
                '--disable-gpu',
                '--headless',
                '--window-size=1920x1080'
            ],
            headless: true
        });
    }

    return puppeteer.launch();
}

export async function getStats(page: puppeteer.Page, url: string | undefined): Promise<{local: any[], visit: any[]}> {
    await page.goto(`${envConfig.domain}${url}`, { waitUntil: 'networkidle2' });

    const dataMatch = await page.$$('.dl');
    let result:any = [];

    for (let match of dataMatch) {

        const elementsWithFootballGoal = await page.evaluate(() => {
            const wrElements = document.querySelectorAll('.Wr');

            const stats: any = {
                local: [],
                visit: []
            }
    
            wrElements.forEach(wrElement => {
                const minuteDataElement = wrElement.querySelector('.bs');
                const currentResultElement = wrElement.querySelector('.as');

                const goalPlayerHome = wrElement.querySelector('[id="home-player__FootballGoal"]');
                const redyellowHome = wrElement.querySelector('[id="home-player__FootballRedYellowCard"]');
                const redHome = wrElement.querySelector('[id="home-player__FootballRedCard"]');
                const yellowHome = wrElement.querySelector('[id="home-player__FootballYellowCard"]');
                const ownGoalHome = wrElement.querySelector('[id="home-player__FootballOwnGoal"]');

                const goalPlayerVisit = wrElement.querySelector('[id="away-player__FootballGoal"]');
                const redyellowVisit = wrElement.querySelector('[id="away-player__FootballRedYellowCard"]');
                const redVisit = wrElement.querySelector('[id="away-player__FootballRedCard"]');
                const yellowVisit = wrElement.querySelector('[id="away-player__FootballYellowCard"]');
                const ownGoalVisit = wrElement.querySelector('[id="away-player__FootballOwnGoal"]');

                const localTeam = {
                    minute: minuteDataElement?.textContent?.trim(),
                    current_result: currentResultElement?.textContent?.trim(),
                    goalHome: goalPlayerHome?.textContent?.trim(),
                    doubleRedHome: redyellowHome?.textContent?.trim(),
                    redHome: redHome?.textContent?.trim(),
                    yellowHome: yellowHome?.textContent?.trim(),
                    ownGoalHome: ownGoalHome?.textContent?.trim()
                }

                if (
                    typeof localTeam.goalHome !== 'undefined' ||
                    typeof localTeam.doubleRedHome !== 'undefined' ||
                    typeof localTeam.redHome !== 'undefined' ||
                    typeof localTeam.yellowHome !== 'undefined' ||
                    typeof localTeam.ownGoalHome !== 'undefined'
                ) {
                    stats.local.push(localTeam);
                }


                const visitTeam = {
                    minute: minuteDataElement?.textContent?.trim(),
                    current_result: currentResultElement?.textContent?.trim(),
                    goalVisit: goalPlayerVisit?.textContent?.trim(),
                    doubleRedVisit: redyellowVisit?.textContent?.trim(),
                    redVisit: redVisit?.textContent?.trim(),
                    yellowVisit: yellowVisit?.textContent?.trim(),
                    ownGoalVisit: ownGoalVisit?.textContent?.trim()
                }

                if (
                    typeof visitTeam.goalVisit !== 'undefined' ||
                    typeof visitTeam.doubleRedVisit !== 'undefined' ||
                    typeof visitTeam.redVisit !== 'undefined' ||
                    typeof visitTeam.yellowVisit !== 'undefined' ||
                    typeof visitTeam.ownGoalVisit !== 'undefined'
                ) {
                    stats.visit.push(visitTeam);
                }
            });
    
            return stats;
        });

        result = elementsWithFootballGoal;
    }
    return result;
}
