import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { State } from '../../types';
import { EpicCherryContext } from '../../utils';
import { ConstantOperation } from './ConstantOperation';

test('renders correctly', () => {
  const state: State = {
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: true,
      },
    ],
    operations: {},
    rootNodeID: '1234',
  };
  const dispatchMock = jest.fn();

  const { container } = render(
    <EpicCherryContext.Provider
      value={{ getValue: (callback) => callback(state), dispatch: dispatchMock }}
    >
      <ConstantOperation
        onValueSelect={jest.fn}
        operation={{ id: '1', parent: null, type: 'argument', value: 'var1' }}
      />
    </EpicCherryContext.Provider>,
  );

  expect(container).toMatchSnapshot();
});

test('renders correctly and calls callback with the selected value', () => {
  const state: State = {
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: true,
      },
    ],
    operations: {},
    rootNodeID: '1234',
  };
  const dispatchMock = jest.fn();
  const onValueSelectMock = jest.fn();

  render(
    <EpicCherryContext.Provider
      value={{ getValue: (callback) => callback(state), dispatch: dispatchMock }}
    >
      <ConstantOperation
        onValueSelect={onValueSelectMock}
        operation={{ id: '1', parent: null, type: 'argument', value: 'var1' }}
      />
    </EpicCherryContext.Provider>,
  );

  userEvent.selectOptions(
    screen.getByRole('combobox'),
    screen.getByRole('option', { name: 'true' }),
  );

  expect(onValueSelectMock).toHaveBeenCalledTimes(1);
  expect(onValueSelectMock).toHaveBeenCalledWith(true);
});
