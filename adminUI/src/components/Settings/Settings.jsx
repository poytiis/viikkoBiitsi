import React, {useEffect, useState} from 'react';
import './Settings.scss';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Layout from '../Layout/Layout';
import Button from '../Button/Button';
import { 
  fetchCountingScoresTimeAjax,
  postCountingScoresTimeAjax, 
  calculateBegingRankingAjax 
} from '../../services/httpClient';


const Settings = () => {

  const [selectedCountingScores, setSelectedCountingScores ] = useState('1');

  useEffect(() => {
    const fetchCountingScoresTime = async () => {
      try {
        const res = await fetchCountingScoresTimeAjax();
        const countingScores = res.data.data[0];
        setSelectedCountingScores(countingScores.toString());
      } catch(ex) {

      }
    };

    fetchCountingScoresTime();
  }, []);

  const handleRadioButtonChange = async (e) => { 
    try {
      await postCountingScoresTimeAjax(e.target.value);
      setSelectedCountingScores(e.target.value);
    } catch(ex) {

    }
  };

  const handleButtonClick = async () => {
    try {
      await calculateBegingRankingAjax();
    } catch(ex) {

    }
  }

  return (
    <Layout>
      <div className='settings flex-column-center'>
        <div className='settings__content flex-column-center'>
          <h2 className='settings__header'>Järjestelmän asetukset</h2>

          <div className='settings__settings__container'>
            <div className='settings__counting-container  flex-colomn'>
              <div className='settings__small-header'>Pisteiden laskentaperiaate:</div>

              <RadioGroup aria-label="counting-scores" name="counting-scores" value={selectedCountingScores} onChange={handleRadioButtonChange}>
                <FormControlLabel value="1" control={<Radio />} label="Viimeisimmän kerran pisteet" />
                <FormControlLabel value="2" control={<Radio />} label="kahden viimekertaisimman kertojen pisteet" />
              </RadioGroup>

            </div>

            <div className='settings__ranking-container'>
              <div className='settings__small-header'>Laske alkuranking -pisteet</div>
              <div className='settings__beging-ranking-info'>Järjestelmä laskee alkuranking-pisteet edellisen kesän pisteiden perusteella.</div>

              <div className='settings__ranking-select-container'>
                <Button onClick={handleButtonClick}>Laske</Button>
              </div>                  
            </div>
          </div>         
        </div>       
    </div>

    </Layout>   
  );
}

export default Settings;
