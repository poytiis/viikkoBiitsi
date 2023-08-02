export interface ShowScores {
    meta_id: string;
    post_id: string;
    meta_key: string;
    meta_value: string;
}

export interface ShowScoresRequest {
    data: ShowScores[];
}