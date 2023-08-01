import React, {useEffect, useState} from 'react';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Layout from '../Layout/Layout';
import Button from '../Button/Button';
import { 
  fetchCountingScoresTimeFetch,
  postCountingScoresTimeAFetch, 
  calculateBegingRankingFetch 
} from '../../services/httpClient';
import SnackBar from '../SnackBar/SnackBar';
import WhiteContainer from '../WhiteContainer/WhiteContainer';


const Settings = () => {

  const [selectedCountingScores, setSelectedCountingScores ] = useState('1');
  const [snackBarMessage, setSnackBarMessage] = useState('');

  useEffect(() => {
    const fetchCountingScoresTime = async () => {
      try {
        const res = await fetchCountingScoresTimeFetch();
        if(!res.ok) setSnackBarMessage('Asetuksien muokkaus epäonnistui');
        else {
          const json = await res.json();
          const countingScores = json.data[0];
          setSelectedCountingScores(countingScores.toString());
        }
        
      } catch(ex) {
        console.log(ex)
        setSnackBarMessage('Asetuksien muokkaus epäonnistui');
      }
    };

    fetchCountingScoresTime();
  }, []);

  const handleRadioButtonChange = async (e) => { 
    try {
      const res = await postCountingScoresTimeAFetch(e.target.value);
      if(!res.ok) setSnackBarMessage('Asetuksien muokkaus epäonnistui');
      else {
        setSelectedCountingScores(e.target.value);
        setSnackBarMessage('Asetuksien muokkaus onnistui');
      }
      
    } catch(ex) {
      setSnackBarMessage('Asetuksien muokkaus epäonnistui');
    }
  };

  const handleButtonClick = async () => {
    try {
      const res = await calculateBegingRankingFetch();
      if(!res.ok) setSnackBarMessage('Alkurankingien laskeminen epäonnistui');
      else setSnackBarMessage('Alkurankingit laskettu onnistuneesti');
    } catch(ex) {
      setSnackBarMessage('Alkurankingien laskeminen epäonnistui');
    }
  }

  return (
    <Layout>
      <WhiteContainer header='Järjestelmän asetukset'>
        <>
          <div className='white-container__counting-container  flex-colomn'>
            <div className='white-container__small-header'>Pisteiden laskentaperiaate:</div>

            <RadioGroup aria-label="counting-scores" name="counting-scores" value={selectedCountingScores} onChange={handleRadioButtonChange}>
              <FormControlLabel value="1" control={<Radio />} label="Viimeisimmän kerran pisteet" />
              <FormControlLabel value="2" control={<Radio />} label="kahden viimekertaisimman kertojen pisteet" />
            </RadioGroup>

          </div>

          <div className='white-container__ranking-container'>
            <div className='white-container__small-header'>Laske alkuranking-pisteet</div>
            <div className='white-container__beging-ranking-info'>Järjestelmä laskee alkuranking-pisteet edellisen kesän pisteiden perusteella.</div>

            <div className='white-container__ranking-select-container'>
              <Button onClick={handleButtonClick}>Laske</Button>
            </div>                  
          </div>     
        </>
      </WhiteContainer>

      { snackBarMessage !== '' &&
        <SnackBar close={() => {setSnackBarMessage('')}}>{snackBarMessage}</SnackBar>
      }

    </Layout>   
  );
}

export default Settings;


