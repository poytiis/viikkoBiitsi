import React, {useState} from 'react';
import './Settings.scss';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Layout from '../Layout/Layout';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '../Button/Button';


const Settings = () => {

  const [selectedCountingWay, setSelectedCountingWay ] = useState('one');

  const handleRadioButtonChange = (e) => {
    console.log(e);
    setSelectedCountingWay(e.target.value);
    
  }
  return (
    <Layout>
      <div className='settings flex-column-center'>
        <div className='settings__content flex-column-center'>
          <h2 className='settings__header'>Järjestelmän asetukset</h2>
        
          <div className='settings__counting-container'>
            <span className='settings__header'>Pisteiden laskentaperiaate</span>

            <RadioGroup aria-label="gender" name="gender1" value={selectedCountingWay} onChange={handleRadioButtonChange}>
              <FormControlLabel value="one" control={<Radio />} label="Viimeisimmän kerran pisteet" />
              <FormControlLabel value="two" control={<Radio />} label="kahden viimekertaisen pisteet" />
            </RadioGroup>

          </div>

          <div className='settings__ranking-container'>
            <span className='settings__header'>Laske alkuranging pisteet</span>

            <div className='settings__ranking-select-container'>
              <InputLabel id="demo-simple-select-label">Pisteet vuodelta</InputLabel>
              <Select className='settings__select-year'  labelId="demo-simple-select-label" value={2019}>
                <MenuItem value={2019}>2019</MenuItem>
                <MenuItem value={2018}>2018</MenuItem>
              </Select>

              <Button>Laske</Button>

            </div>
                   
          </div>
         
        </div>       
    </div>

    </Layout>   
  );
}

export default Settings;
