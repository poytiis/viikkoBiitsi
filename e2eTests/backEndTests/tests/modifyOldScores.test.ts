import axios from "axios";
import { axiosLogIn, baseUrl, querySingleDatabase } from "../helpers";
import { deleteScoresQuery, insertScoresQuery, queryById, selectAllScoresQuery } from '../SQLData/viikon_tulokset';
import { updateOldScores } from '../ResponseData/viikon_tulokset';

describe('Modify old scores: ', () => {
  it('delete score', async () => {
    await querySingleDatabase(deleteScoresQuery)
    await querySingleDatabase(insertScoresQuery)
    const config = await axiosLogIn();
    const scoreId = 5334;
    const invalidId = 99999;
    const searchQuery = queryById + scoreId.toString();
    
    let resulsts: any = await querySingleDatabase(searchQuery);
    expect(resulsts.length).toBe(1);
    const allScores: any = await querySingleDatabase(selectAllScoresQuery);

    await axios.post(baseUrl + 'delete_old_scores.php', {id: scoreId}, config);
    resulsts = await querySingleDatabase(searchQuery);
    expect(resulsts.length).toBe(0);

    const newAllScores: any = await querySingleDatabase(selectAllScoresQuery);
    expect(allScores.length -1).toBe(newAllScores.length);
 
    await axios.post(baseUrl + 'delete_old_scores.php', {id: invalidId}, config);
    const allScoresAfterInvalidId: any = await querySingleDatabase(selectAllScoresQuery);
    expect(allScoresAfterInvalidId.length).toBe(newAllScores.length);
  })


  it('modify score', async () => {
    const config = await axiosLogIn();
    console.log(config)
    for(let score of updateOldScores) {
      await querySingleDatabase(deleteScoresQuery)
      await querySingleDatabase(insertScoresQuery)
      await axios.post(baseUrl + 'update_old_scores.php', score, config);
      const searchQuery = queryById + score.id.toString();
      let resulsts: any = await querySingleDatabase(searchQuery);

      expect(resulsts[0].nimi).toBe(score.name);
      expect(resulsts[0].viikko).toBe(score.week);
      expect(resulsts[0].lohko).toBe(score.pool);
      expect(resulsts[0].sarja).toBe(score.serie);
      expect(resulsts[0].pelatut_pisteet).toBe(score.playedScores);
      expect(resulsts[0].sarja_pisteet).toBe(score.serieScores);
      expect(resulsts[0].sijoitus).toBe(score.ranking);
    }
  });
});