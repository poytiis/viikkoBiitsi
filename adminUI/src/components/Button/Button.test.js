import {render, fireEvent, screen} from '@testing-library/react';
import Button from './Button';

it('show button text', () => {
    const buttonText = 'Test';
    render(<Button>{buttonText}</Button>)
    expect(screen.getByText(buttonText)).toBeInTheDocument()
});

it('disable button', () => {
    const buttonText = 'Test';
    render(<Button disabled={true}>{buttonText}</Button>)
    expect(screen.getByText(buttonText)).toBeDisabled()
});