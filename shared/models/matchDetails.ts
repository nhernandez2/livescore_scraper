export interface NextMatchDetails {
    idTeam: number;
    homeTeamName: string;
    awayTeamName: string;
    dateDay: string;
    dayTime: string;
    date?: Date;
    urlNextMatch: string;
    statistics?: any[];
}

export interface LastMatchDetails {
    idTeam: number;
    homeTeamName: string;
    awayTeamName: string;
    resultMatch: string;
    status: string;
    statistics?: any;
    urlStats?: string;
}

export interface MatchTeam {
    lastMatchDetails: LastMatchDetails[];
}