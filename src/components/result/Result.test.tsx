import { render, screen } from '@testing-library/react';
import { State } from '../../types';
import { EpicCherryContext } from '../../utils';
import { Result } from './Result';
import { calculateResult as calculateResultMock } from './calculateResult';

jest.mock('./calculateResult');

test('renders default result', () => {
  const state: State = {
    variables: [],
    operations: {},
    rootNodeID: '1234',
  };
  const dispatchMock = jest.fn();

  render(
    <EpicCherryContext.Provider
      value={{ getValue: (callback) => callback(state), dispatch: dispatchMock }}
    >
      <Result />
    </EpicCherryContext.Provider>,
  );

  const finalResultElement = screen.getByText(/final result/i);

  expect(finalResultElement).toBeInTheDocument();
  expect(screen.getByText('undefined')).toBeInTheDocument();
});

test('renders calculated result', () => {
  const state: State = {
    variables: [],
    operations: {},
    rootNodeID: '1234',
  };
  const dispatchMock = jest.fn();
  (calculateResultMock as jest.Mock).mockReturnValueOnce(true);

  render(
    <EpicCherryContext.Provider
      value={{ getValue: (callback) => callback(state), dispatch: dispatchMock }}
    >
      <Result />
    </EpicCherryContext.Provider>,
  );

  const finalResultElement = screen.getByText(/final result/i);

  expect(finalResultElement).toBeInTheDocument();
  expect(screen.getByText('true')).toBeInTheDocument();
});

test('calls calculate result with correct params', () => {
  const state: State = {
    variables: [{ id: '1', name: 'foo', value: true }],
    operations: {},
    rootNodeID: '1234',
  };
  const dispatchMock = jest.fn();
  (calculateResultMock as jest.Mock).mockReturnValueOnce(true);

  render(
    <EpicCherryContext.Provider
      value={{ getValue: (callback) => callback(state), dispatch: dispatchMock }}
    >
      <Result />
    </EpicCherryContext.Provider>,
  );

  expect(calculateResultMock).toHaveBeenCalledTimes(1);
  expect(calculateResultMock).toHaveBeenCalledWith({
    variables: state.variables,
    operations: state.operations,
    nodeId: state.rootNodeID,
  });
});
