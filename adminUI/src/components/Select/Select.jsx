import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import MUISelect from '@material-ui/core/Select';

const Select = (props) => {
  const options = props.control.options.map(option =>{
    return (
      <MenuItem value={option.value} key={option.value} id={'select-input-option-' + option.value}>
        {option.text}
      </MenuItem>
    );
  });
  return (
    <FormControl className={props.className || ''} variant='standard' sx={{m: 1, minWidth: 120} }>
      <InputLabel id={'select-input-label-' + props.id}>{props.label}</InputLabel>
      <MUISelect
        labelId={'select-input-label-' + props.id}
        id={'select-' + props.id}
        value={props.control.value}
        onChange={(e) => {props.control.handleOnClick(e)}}
      >
        {options}
      </MUISelect>
    </FormControl>
  );
};

export default Select;
