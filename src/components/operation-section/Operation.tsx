import { Dispatch } from 'react';
import { Actions, OperationDefinition } from '../../types';
import { useDispatch } from '../../utils';
import { ArgumentOperation } from './ArgumentOperation';
import { ConstantOperation } from './ConstantOperation';
import { LogicalOperation } from './LogicalOperation';
import { SelectOperation } from './SelectOperation';

const actionsMap = {
  and: (dispatch: Dispatch<Actions>, operation: OperationDefinition) => (type: 'and' | 'or') =>
    dispatch({
      type: 'selectOperation',
      payload: {
        type,
        id: operation.id,
        value: null,
      },
    }),
  or: (dispatch: Dispatch<Actions>, operation: OperationDefinition) => (type: 'and' | 'or') =>
    dispatch({
      type: 'selectOperation',
      payload: {
        type,
        id: operation.id,
        value: null,
      },
    }),
  select:
    (dispatch: Dispatch<Actions>, operation: OperationDefinition) =>
    (type: OperationDefinition['type']) =>
      dispatch({
        type: 'selectOperation',
        payload: {
          type,
          id: operation.id,
          value: null,
        },
      }),
  argument:
    (dispatch: Dispatch<Actions>, operation: OperationDefinition) => (value: string | null) =>
      dispatch({
        type: 'setOperationValue',
        payload: {
          type: 'argument',
          id: operation.id,
          value,
        },
      }),
  constant: (dispatch: Dispatch<Actions>, operation: OperationDefinition) => (value: boolean) =>
    dispatch({
      type: 'setOperationValue',
      payload: {
        type: 'constant',
        id: operation.id,
        value,
      },
    }),
};

export const Operation = ({ operation }: { operation: OperationDefinition }) => {
  const dispatch = useDispatch();

  switch (operation.type) {
    case 'select': {
      return <SelectOperation onValueSelect={actionsMap[operation.type](dispatch, operation)} />;
    }
    case 'constant': {
      return (
        <ConstantOperation
          operation={operation}
          onValueSelect={actionsMap[operation.type](dispatch, operation)}
        />
      );
    }
    case 'argument': {
      return (
        <ArgumentOperation
          operation={operation}
          onValueSelect={actionsMap[operation.type](dispatch, operation)}
        />
      );
    }
    default:
      return (
        <LogicalOperation
          operation={operation}
          onValueSelect={actionsMap[operation.type](dispatch, operation)}
        />
      );
  }
};
