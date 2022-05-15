/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint, @typescript-eslint/no-empty-function */
import { createContext, useContext } from 'react';
import { Actions, UseSelectorCallback, UseSelectorType } from '../types';

export const defaultGetValue: UseSelectorType = <R extends unknown>(
  callback: UseSelectorCallback<R>,
): R => {
  return undefined as R;
};

export const EpicCherryContext = createContext<{
  dispatch: React.Dispatch<Actions>;
  getValue: UseSelectorType;
}>({
  dispatch: () => {},
  getValue: defaultGetValue,
});

export const useSelector = <R extends unknown>(callback: UseSelectorCallback<R>) => {
  const { getValue } = useContext(EpicCherryContext);
  return getValue(callback);
};

export const useDispatch = () => {
  const { dispatch } = useContext(EpicCherryContext);
  return dispatch;
};
