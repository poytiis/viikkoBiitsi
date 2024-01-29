export const insertScoresQuery = `
INSERT INTO viikon_tulokset VALUES
(5334, 'Player 2', 'Naiset', 12, 1, 1, 1, 12, 2022),
(5335, 'Player 1', 'Naiset', 31, 1, 2, 1, 19.15, 2022),
(5336, 'Player 3', 'Naiset', 31, 1, 3, -1, 18.05, 2022),
(5337, 'Player 4', 'Naiset', 31, 1, 4, -2, 17, 2022),
(5338, 'Player 6', 'Miehet', 31, 1, 1, 2, 20.2, 2022),
(5339, 'Player 5', 'Miehet', 31, 1, 2, 1, 19.15, 2022),
(5340, 'Player 7', 'Miehet', 31, 1, 3, -1, 18.05, 2022),
(5341, 'Player 8', 'Miehet', 31, 1, 4, -20, 16.1, 2022),
(5342, 'Player 2', 'Naiset', 32, 1, 1, 2, 20.2, 2022),
(5343, 'Player 1', 'Naiset', 32, 1, 2, 1, 19.15, 2022),
(5344, 'Player 3', 'Naiset', 32, 1, 3, -1, 18.05, 2022),
(5345, 'Player 4', 'Naiset', 32, 1, 4, -2, 17, 2022),
(5346, 'Player 6', 'Miehet', 32, 1, 1, 2, 20.2, 2022),
(5347, 'Player 5', 'Miehet', 32, 1, 2, 1, 19.15, 2022),
(5348, 'Player 7', 'Miehet', 32, 1, 3, -1, 18.05, 2022),
(5349, 'Player 8', 'Miehet', 32, 1, 4, -2, 17, 2022),
(5350, 'Player 2', 'Naiset', 33, 1, 1, 2, 20.2, 2022),
(5351, 'Player 1', 'Naiset', 33, 1, 2, 1, 19.15, 2022),
(5352, 'Player 3', 'Naiset', 33, 1, 3, -1, 18.05, 2022),
(5353, 'Player 4', 'Naiset', 33, 1, 4, -2, 17, 2022),
(5354, 'Player 6', 'Miehet', 33, 1, 1, 2, 20.2, 2022),
(5355, 'Player 5', 'Miehet', 33, 1, 2, 1, 19.15, 2022),
(5356, 'Player 7', 'Miehet', 33, 1, 3, -1, 18.05, 2022),
(5357, 'Player 8', 'Miehet', 33, 1, 4, -2, 17, 2022),
(5358, 'Player 2', 'Naiset', 34, 1, 1, 2, 20.2, 2022),
(5359, 'Player 1', 'Naiset', 34, 1, 2, 1, 19.15, 2022),
(5360, 'Player 3', 'Naiset', 34, 1, 3, -1, 18.05, 2022),
(5361, 'Player 4', 'Naiset', 34, 1, 4, -2, 17, 2022),
(5362, 'Player 6', 'Miehet', 34, 1, 1, 2, 20.2, 2022),
(5363, 'Player 5', 'Miehet', 34, 1, 2, 1, 19.15, 2022),
(5364, 'Player 7', 'Miehet', 34, 1, 3, -1, 18.05, 2022),
(5365, 'Player 8', 'Miehet', 34, 1, 4, -2, 17, 2022),
(5366, 'Player 2', 'Naiset', 35, 1, 1, 2, 20.2, 2022),
(5367, 'Player 1', 'Naiset', 35, 1, 2, 1, 19.15, 2022),
(5368, 'Player 3', 'Naiset', 35, 1, 3, -1, 18.05, 2022),
(5369, 'Player 4', 'Naiset', 35, 1, 4, -2, 17, 2022),
(5370, 'Player 6', 'Miehet', 35, 1, 1, 2, 20.2, 2022),
(5371, 'Player 5', 'Miehet', 35, 1, 2, 1, 19.15, 2022),
(5372, 'Player 7', 'Miehet', 35, 1, 3, -1, 18.05, 2022),
(5373, 'Player 8', 'Miehet', 35, 1, 4, -2, 17, 2022),
(5374, 'Player 2', 'Naiset', 32, 1, 1, 2, 20.2, 2023),
(5375, 'Player 1', 'Naiset', 32, 1, 2, 1, 19.15, 2023),
(5376, 'Player 3', 'Naiset', 32, 1, 3, -1, 18.05, 2023),
(5377, 'Player 4', 'Naiset', 32, 1, 4, -2, 17, 2023),
(5378, 'Player 6', 'Miehet', 32, 1, 1, 2, 20.2, 2023),
(5379, 'Player 5', 'Miehet', 32, 1, 2, 1, 19.15, 2023),
(5380, 'Player 7', 'Miehet', 32, 1, 3, -1, 18.05, 2023),
(5381, 'Player 8', 'Miehet', 32, 1, 4, -2, 17, 2023);
`;

export const insertScoresQuery2 = `
INSERT INTO viikon_tulokset VALUES
(5334, 'Player 1', 'Miehet', 1, 1, 1, 1, 12, 2022),
(5335, 'Player 1', 'Miehet', 2, 1, 2, 1, 19.15, 2022),
(5336, 'Player 1', 'Miehet', 3, 1, 3, -1, 18.05, 2022),
(5337, 'Player 1', 'Miehet', 4, 1, 4, -2, 17, 2022),
(5338, 'Player 1', 'Miehet', 5, 1, 1, 2, 20.2, 2022),
(5339, 'Player 1', 'Miehet', 6, 1, 2, 1, 19.15, 2022),
(5340, 'Player 1', 'Miehet', 7, 1, 3, -1, 10, 2022),
(5341, 'Player 2', 'Miehet', 1, 1, 4, -20, 16.1, 2022),
(5342, 'Player 2', 'Naiset', 2, 1, 1, 2, 20.2, 2022),
(5343, 'Player 2', 'Naiset', 3, 1, 2, 1, 19.15, 2022),
(5344, 'Player 2', 'Naiset', 4, 1, 3, -1, 18.05, 2022),
(5345, 'Player 2', 'Naiset', 5, 1, 4, -2, 17, 2022),
(5346, 'Player 2', 'Naiset', 6, 1, 1, 2, 20.2, 2022),
(5347, 'Player 2', 'Naiset', 7, 1, 2, 1, 19.15, 2022),
(5348, 'Player 2', 'Naiset', 8, 1, 3, -1, 100, 2022);
`;

export const deleteScoresQuery = `DELETE FROM viikon_tulokset`;

export const selectAllScoresQuery = `SELECT * FROM viikon_tulokset`;

export const queryById = 'SELECT * FROM viikon_tulokset WHERE id=';

const year = new Date().getFullYear();

export const moveRankingYearQuery1 = `UPDATE viikon_tulokset SET vuosi=` + (year - 2 ).toString() + ' WHERE vuosi=2023';
export const moveRankingYearQuery2 = `UPDATE viikon_tulokset SET vuosi=` + (year - 1 ).toString() + ' WHERE vuosi=2022';
export const moveRankingYearQuery3 = `UPDATE viikon_tulokset SET vuosi=` + (year).toString() + ' WHERE vuosi=2023';
export const moveRankingYearQueryThisYear = `UPDATE viikon_tulokset SET vuosi=` + (year).toString() + ' WHERE vuosi=2022';

export const selectBegingRankings = `SELECT * FROM viikon_tulokset WHERE viikko=0;`