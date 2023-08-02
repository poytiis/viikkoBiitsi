import axios from 'axios';
import { baseUrl, queryDatabase, axiosLogIn, querySingleDatabase } from './helpers';
import { ShowScoresRequest } from './types';
import { insertValidPools2, deletePools } from './SQLData/wpzl_postmeta';
import { deleteScoresQuery, selectAllScoresQuery} from './SQLData/viikon_tulokset';
import { poolScoresPools2 } from './ResponseData/viikon_tulokset';

describe('Calculate scores: ', () => {

  it('fetch scores', async () => {
    queryDatabase([deletePools, insertValidPools2]);
    const scoresRequest = await axios.get<ShowScoresRequest>(baseUrl + 'show_scores.php',);
    const scores = scoresRequest.data.data;
    const scoresLenght = scoresRequest.data.data.length;

    expect(scoresLenght).toBe(24);

    scores.forEach(score => {
      const metaIdFound = insertValidPools2.includes(score.meta_id);
      const metaKeyFound = insertValidPools2.includes(score.meta_key);
      const metaValueFound = insertValidPools2.includes(score.meta_value);
      const postIdFound = insertValidPools2.includes(score.post_id);

      expect(metaIdFound).toBe(true);
      expect(metaKeyFound).toBe(true);
      expect(metaValueFound).toBe(true);
      expect(postIdFound).toBe(true);
    });
  });

  it('calculate scores 2 pools', async () => {
    const config = await axiosLogIn();
    await queryDatabase([deleteScoresQuery, deletePools, insertValidPools2]);
    await axios.get(baseUrl + 'calculate_scores.php', config);
    const resulsts: any = await querySingleDatabase(selectAllScoresQuery);
    poolScoresPools2.forEach(row => {
      const rowInDB = resulsts.find(element => element.nimi === row.name)
      expect(row.score.toFixed(2).toString()).toBe(rowInDB.sarja_pisteet.toFixed(2));
      expect(row.ranking).toBe(rowInDB.sijoitus);
      expect(row.pool).toBe(rowInDB.lohko);
    })
  });
});
