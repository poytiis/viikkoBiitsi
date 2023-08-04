import axios from 'axios';
import { baseUrl, queryDatabase, axiosLogIn, querySingleDatabase } from '../helpers';
import { ShowScoresRequest } from '../types';
import { insertValidPools2, deletePools, insertValidPools5 } from '../SQLData/wpzl_postmeta';
import { deleteScoresQuery, selectAllScoresQuery, insertScoresQuery} from '../SQLData/viikon_tulokset';
import { poolScoresPools2, poolScoresPools5 } from '../ResponseData/viikon_tulokset';
import { selectAllMensRanking, selectAllWomensRanking } from '../SQLData/kokonais_tulokset';
import { menRanking, womenRanking } from '../ResponseData/kokonais_tulokset';

describe('Calculate scores: ', () => {

  it('fetch scores', async () => {
    queryDatabase([deletePools, insertValidPools2]);
    const config = await axiosLogIn();
    const scoresRequest = await axios.get<ShowScoresRequest>(baseUrl + 'show_scores.php', config);
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

  it('calculate scores', async () => {
    const config = await axiosLogIn();

    const insertQueries = [insertValidPools2, insertValidPools5];
    const validateData = [poolScoresPools2, poolScoresPools5];

    for(let i = 0; i < validateData.length; i++) {
      await queryDatabase([deleteScoresQuery, deletePools, insertQueries[i]]);
      await axios.get(baseUrl + 'calculate_scores.php', config);
      const resulsts: any = await querySingleDatabase(selectAllScoresQuery);
      validateData[i].forEach(row => {
        const rowInDB = resulsts.find(element => element.nimi === row.name)
        expect(row.score.toFixed(2).toString()).toBe(rowInDB.sarja_pisteet.toFixed(2));
        expect(row.ranking).toBe(rowInDB.sijoitus);
        expect(row.pool).toBe(rowInDB.lohko);
      })
    }  
  });

  it('update rankings', async () => {
    const config = await axiosLogIn();
    await queryDatabase([deleteScoresQuery, insertScoresQuery]);
    await axios.get(baseUrl + 'calculate_scores.php?update_only=true', config);

    const womenResulsts: any = await querySingleDatabase(selectAllWomensRanking);
    const menResulsts: any = await querySingleDatabase(selectAllMensRanking);
    const rankingLists = [[womenRanking, womenResulsts], [menRanking, menResulsts]];

    rankingLists.forEach(rankingList => {
      rankingList[0].forEach(ranking => {
        const rankingInDB =  rankingList[1].find(row => row.nimi === ranking.name)
        expect(rankingInDB.viikko_1.toFixed(2)).toBe(ranking.week1.toFixed(2));
        expect(rankingInDB.viikko_2.toFixed(2)).toBe(ranking.week2.toFixed(2));
        expect(rankingInDB.total.toFixed(2)).toBe(ranking.total.toFixed(2));
      });
    })

    
  })

  it('dummy', async () => {
      const res = await axios.get(baseUrl + 'index.php');
      console.log(res.data);
      // expect(res.data).toBe(31);
  });
});
