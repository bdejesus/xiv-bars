import '@testing-library/jest-dom';
import 'tests/setupTests';
import { render, screen, fireEvent } from '@testing-library/react';
import ViewControl, { defaultView } from 'components/LayoutsList/ViewControl';

jest.mock('@sentry/nextjs', () => ({ captureException: jest.fn() }));

describe('ViewControl', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockClear();
    render(<ViewControl id="test" onChange={onChange} />);
  });

  it('renders sort radio buttons', () => {
    expect(screen.getByLabelText(/most recent/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/most hearts/i)).toBeInTheDocument();
  });

  it('renders filter checkboxes for all filter types', () => {
    expect(screen.getByLabelText('XHB')).toBeInTheDocument();
    expect(screen.getByLabelText('HB')).toBeInTheDocument();
    expect(screen.getByLabelText('PVP')).toBeInTheDocument();
    expect(screen.getByLabelText('PVE')).toBeInTheDocument();
  });

  it('all filters are checked by default', () => {
    ['XHB', 'HB', 'PVP', 'PVE'].forEach((filter) => {
      expect(screen.getByLabelText(filter)).toBeChecked();
    });
  });

  it('calls onChange with updated sortBy when sort radio changes', () => {
    fireEvent.click(screen.getByLabelText(/most hearts/i));
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ sortBy: 'hearts' }));
  });

  it('removes a filter when its checkbox is unchecked', () => {
    fireEvent.click(screen.getByLabelText('PVP'));
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ filters: expect.not.arrayContaining(['PVP']) })
    );
  });

  it('adds a filter back when its checkbox is re-checked', () => {
    const pvpCheckbox = screen.getByLabelText('PVP');
    fireEvent.click(pvpCheckbox); // uncheck
    fireEvent.click(pvpCheckbox); // re-check
    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({ filters: expect.arrayContaining(['PVP']) })
    );
  });

  it('exports a defaultView with all filters and recent sort', () => {
    expect(defaultView.sortBy).toBe('recent');
    expect(defaultView.filters).toEqual(expect.arrayContaining(['XHB', 'HB', 'PVP', 'PVE']));
  });
});
