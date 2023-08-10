import axios from 'axios';
import { baseUrl, axiosLogIn, querySingleDatabase } from '../helpers';
import { ShowScoresRequest } from '../types';
import { insertValidPools2, deletePools, insertValidPools5, selectAllPools } from '../SQLData/wpzl_postmeta';
import { deleteScoresQuery, selectAllScoresQuery, insertScoresQuery, moveRankingYearQuery1, moveRankingYearQuery2, insertScoresQuery2, selectBegingRankings, moveRankingYearQueryThisYear} from '../SQLData/viikon_tulokset';
import { poolScoresPools2, poolScoresPools5 } from '../validationData/viikon_tulokset';
import { selectAllMensRanking, selectAllWomensRanking } from '../SQLData/kokonais_tulokset';
import { menRanking, rankingBegingRanking, rankingBegingRanking2, rankingCountingScores, womenRanking } from '../validationData/kokonais_tulokset';
import { updateCountingScores } from '../SQLData/viikko_biitsi_hallinta';

describe('Calculate scores: ', () => {
  it('fetch scores', async () => {
    await querySingleDatabase(deletePools);
    await querySingleDatabase(insertValidPools2);
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

  it('calculate ranking', async () => {
    const config = await axiosLogIn();

    const insertQueries = [insertValidPools2, insertValidPools5];
    const validateData = [poolScoresPools2, poolScoresPools5];

    for(let i = 0; i < validateData.length; i++) {
      await querySingleDatabase(deleteScoresQuery);
      await querySingleDatabase(deletePools);
      await querySingleDatabase(insertQueries[i]);
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
    await querySingleDatabase(deleteScoresQuery);
    await querySingleDatabase(insertScoresQuery);
    await querySingleDatabase(deletePools);
    await querySingleDatabase(insertValidPools2);

    const beforeUpdatePools: any = await querySingleDatabase(selectAllPools);
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
    const afterUpdatePools: any = await querySingleDatabase(selectAllPools);

    expect(beforeUpdatePools.length).toBe(afterUpdatePools.length)
  })

  it('calculate beging ranking', async () => {
    const queries = [insertScoresQuery, insertScoresQuery2];
    const validationData = [rankingBegingRanking, rankingBegingRanking2]
    const config = await axiosLogIn();

    for(let i = 0; i < queries.length; i++) {
      await querySingleDatabase(deleteScoresQuery);
      await querySingleDatabase(queries[i]);
      await querySingleDatabase(moveRankingYearQuery1);
      await querySingleDatabase(moveRankingYearQuery2);

      await axios.get(baseUrl + 'calculate_beging_ranking.php', config);
      const rankings = await querySingleDatabase(selectBegingRankings);
     
      const womenResulsts: any = await querySingleDatabase(selectAllWomensRanking);
      const menResulsts: any = await querySingleDatabase(selectAllMensRanking);
      const mergedRankings = [...womenResulsts, ...menResulsts]

      expect(mergedRankings.length).not.toBe(0);
      expect(rankings.length).not.toBe(0);

      rankings.forEach(element => {
        const score =  validationData[i].find(result => result.name === element.nimi);
        expect(score).toBeTruthy()
        expect(score?.week1.toFixed(2)).toBe(element.sarja_pisteet.toFixed(2))
      });
      
      mergedRankings.forEach(element => {
        const score =  validationData[i].find(result => result.name === element.nimi);
        expect(score).toBeTruthy()
        expect(score?.week1.toFixed(2)).toBe(element.viikko_1.toFixed(2))
      })     
    } 
  });

  it('update ranking different score count', async () => {
    const config = await axiosLogIn();
    const countingScores = [1, 2];

   for(let i = 0; i < countingScores.length; i++ ) {
    await querySingleDatabase(deleteScoresQuery);
    await querySingleDatabase(insertScoresQuery2);
    await querySingleDatabase(moveRankingYearQueryThisYear);

    const updateQuery = updateCountingScores(countingScores[i]);
    await querySingleDatabase(updateQuery);

    await axios.get(baseUrl + 'calculate_scores.php?update_only=true', config);

    const womenResulsts: any = await querySingleDatabase(selectAllWomensRanking);
    const menResulsts: any = await querySingleDatabase(selectAllMensRanking);
    const mergedRankings = [...womenResulsts, ...menResulsts];

    expect(mergedRankings.length).not.toBe(0);

    mergedRankings.forEach(element => {
      const score =  rankingCountingScores.find(result => result.name === element.nimi);
      expect(score).toBeTruthy();

      if(score) {
        const totalScore = countingScores[i] === 1
        ? score.week1.toFixed(2)
        : parseFloat(score.week1.toFixed(2)) + parseFloat(score?.week2.toFixed(2))

        expect(score.week1.toFixed(2)).toBe(element.viikko_1.toFixed(2))
        expect(score.week2.toFixed(2)).toBe(element.viikko_2.toFixed(2))
        expect(totalScore.toString()).toBe(element.total.toFixed(2))   
      }    
    })  
   }
  })
});
