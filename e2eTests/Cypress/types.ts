export interface SearchOldResult {
    player: string | null;
    year: number | null;
    week: number | null;
    serie: 'Naiset' | 'Miehet' | null;
    pool: number | null;
}

export interface SearchOldResultErrorMessage {
    player: string ;
    year: string;
    week: string;
    serie: string;
    pool: string;
    plusMinusPoints: string;
    seriePoints: string;
}

export interface OldResult extends SearchOldResult {
    plusMinusPoints: number | null;
    ranking: number | null;
    seriePoints: number | null;
}

export interface OldResultSearchParams extends SearchOldResult{
    results: SearchOldResult[];
}

export interface OldResultSearchInputValidation {
    input: SearchOldResult;
    errorMessage: SearchOldResultErrorMessage;
}

export interface OldResultModifyInputValidation {
    input: OldResult;
    errorMessage: SearchOldResultErrorMessage;
}

export interface OldResultModifyParams {
    searchParams: SearchOldResult;
    modifyParams: OldResult
}

export interface OldScores {
    searchParams: OldResultSearchParams[];
    modifyParams: OldResultModifyParams[];
    searchInputValidation: OldResultSearchInputValidation[];
    modifyInputValidation: OldResultModifyInputValidation[];
}

export interface WeekResult {
    player: string;
    plusMinusPoints: number;
    serie: 'Naiset' | 'Miehet' | null;
    pool: number;
}

export interface WeekResultErrorMessage {
    player: string;
    plusMinusPoints: string;
    pool: string;
}

export interface invalidUpdatePlayer {
    input: WeekResult;
    errorMessage:WeekResultErrorMessage;
}

export interface Scores {
    scores: WeekResult[];
    updatePlayer: WeekResult;
    invalidUpdatePlayers: invalidUpdatePlayer[];
}

export interface AuthenticationUser {
    username: string;
    password: string;
}

export interface Authentication {
    validUser: AuthenticationUser;
    invalidUsers: AuthenticationUser[];
}