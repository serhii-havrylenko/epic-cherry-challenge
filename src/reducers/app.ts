import { v4 as uuidV4 } from 'uuid';

import {
  Actions,
  OperationDefinition,
  Operations,
  SelectOperationAction,
  State,
  VariableDefinition,
} from '../types';
import {
  getVariableById,
  getVariableByName,
  getAllDescendantsOperations,
  getOperationChildren,
  getOperationSiblings,
} from '../selectors';

const createNewOperationNode = (parent: string | null, id = uuidV4()): OperationDefinition => ({
  parent,
  id,
  type: 'select',
  value: null,
});

const rootNodeID = uuidV4();

export const initialState: State = {
  variables: [],
  operations: {
    [rootNodeID]: createNewOperationNode(null, rootNodeID),
  },
  rootNodeID,
};

const updateVariableInState = (
  variables: VariableDefinition[],
  newVariable: Pick<VariableDefinition, 'id'> & Partial<VariableDefinition>,
) =>
  variables.reduce((acc, variable) => {
    if (variable.id === newVariable.id) {
      return [
        ...acc,
        {
          ...variable,
          ...newVariable,
        },
      ];
    }
    return [...acc, variable];
  }, [] as VariableDefinition[]);

const deleteOperation = (operations: Operations, id: string): Operations => {
  if (!operations[id].parent) {
    return initialState.operations;
  }

  const descendants = getAllDescendantsOperations(operations, id);

  return Object.values(operations).reduce((acc, operation) => {
    if (operation.id === id && operation.parent) {
      const siblings = getOperationSiblings(operations, operation.parent, id);

      if (siblings.length >= 2) {
        return acc;
      }

      return {
        ...acc,
        [operation.id]: {
          ...operation,
          type: 'select',
          value: null,
        },
      };
    }

    if (descendants.some((descendant) => descendant.id === operation.id)) {
      return acc;
    }

    return {
      ...acc,
      [operation.id]: operation,
    };
  }, {} as Operations);
};

const selectOperation = (operations: Operations, payload: SelectOperationAction['payload']) => {
  const newFields =
    payload.type === 'constant'
      ? { value: true, type: payload.type }
      : {
          type: payload.type,
          value: payload.value,
        };

  const childOperations: Operations = {};
  if (
    ['and', 'or'].includes(payload.type) &&
    getOperationChildren(operations, payload.id).length < 2
  ) {
    const child1 = createNewOperationNode(payload.id);
    const child2 = createNewOperationNode(payload.id);
    childOperations[child1.id] = child1;
    childOperations[child2.id] = child2;
  }

  return {
    ...operations,
    ...childOperations,
    [payload.id]: {
      ...operations[payload.id],
      ...newFields,
    },
  };
};

export const reducer = (state: State, { type, payload }: Actions): State => {
  switch (type) {
    case 'addVariable': {
      return {
        ...state,
        variables: [...state.variables, { id: payload, value: true, name: '' }],
      };
    }
    case 'changeVariableName': {
      if (getVariableByName(state.variables, payload.name)) {
        const variable = getVariableById(state.variables, payload.id);
        if (!variable) {
          return state;
        }
        return {
          ...state,
          variables: updateVariableInState(state.variables, {
            ...variable,
            error: true,
          }),
        };
      }
      return {
        ...state,
        variables: updateVariableInState(state.variables, {
          ...payload,
          error: false,
        }),
      };
    }
    case 'changeVariableValue': {
      return {
        ...state,
        variables: updateVariableInState(state.variables, payload),
      };
    }
    case 'selectOperation': {
      return {
        ...state,
        operations: selectOperation(state.operations, payload),
      };
    }
    case 'setOperationValue': {
      return {
        ...state,
        operations: {
          ...state.operations,
          [payload.id]: {
            ...state.operations[payload.id],
            ...payload,
          },
        },
      };
    }
    case 'addOperation': {
      return {
        ...state,
        operations: {
          ...state.operations,
          [payload.id]: {
            ...payload,
            type: 'select',
            value: null,
          },
        },
      };
    }
    case 'deleteOperation': {
      return {
        ...state,
        operations: deleteOperation(state.operations, payload),
      };
    }
    default:
      throw new Error();
  }
};
