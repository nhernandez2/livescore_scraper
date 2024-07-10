export interface MatchStatistics {
    localTeam: TeamStatistic;
    visitorTeam: TeamStatistic;
}

export interface TeamStatistic {
    minute: string;
    goalPlayer: string;
    yellowCardsPlayer: string;
    redCardsPlayer: string;
    doubleYellowCardsPlayer: string;
    ownGoalsPlayer: string;
    currentResult: string;
}