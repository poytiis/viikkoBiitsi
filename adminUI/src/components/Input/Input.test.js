import {render, screen, fireEvent} from '@testing-library/react';
import Input from './Input';
import useInput from '../../hooks/useInput';

const TestInput = (props) => {
    const control = useInput(props.initialvalue);
  
    return (
      <Input control={control}/>
    );
}

it('initialize input', () => {
    const testValue = 'Test'
    render(<TestInput initialvalue={testValue}/>)

    expect(screen.getByDisplayValue(testValue)).toBeInTheDocument();
});

it('change text', () => {
    const initValue = 'Init'
    render(<TestInput initialvalue={initValue}/>)
    
    const inputText = 'Text';
    const inputNode = screen.getByDisplayValue(initValue);

    fireEvent.change(inputNode, { target: { value: inputText } });

    expect(screen.getByDisplayValue(inputText)).toBeInTheDocument();
});