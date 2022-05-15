/* eslint-disable @typescript-eslint/no-unnecessary-type-constraint */
import { useReducer } from 'react';
import './App.css';
import { EpicCherryContext } from './utils';
import { OperationsSection, Result, VariablesList } from './components';
import {
  Actions,
  OperationDefinition,
  Operations,
  State,
  UseSelectorCallback,
  VariableDefinition,
} from './types';

import { v4 as uuidV4 } from 'uuid';
import { getVariableById, getVariableByName } from './selectors';
import { getSiblings } from './selectors/operations';

const createNewOperationNode = (parent: string | null, id = uuidV4()): OperationDefinition => ({
  parent,
  id,
  type: 'select',
  value: null,
});

const rootNodeID = uuidV4();
const initialState: State = {
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

const hasChildOperations = (operations: Operations, id: string) =>
  Object.values(operations).find(({ parent }) => parent === id);

// FIXME: split global reducer into set of smaller
function reducer(state: State, { type, payload }: Actions): State {
  console.log({ type, payload });
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
        !hasChildOperations(state.operations, payload.id)
      ) {
        console.log('trigger addOperation');
        const child1 = createNewOperationNode(payload.id);
        const child2 = createNewOperationNode(payload.id);
        childOperations[child1.id] = child1;
        childOperations[child2.id] = child2;
      }

      return {
        ...state,
        operations: {
          ...state.operations,
          ...childOperations,
          [payload.id]: {
            ...state.operations[payload.id],
            ...newFields,
          },
        },
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
      if (!state.operations[payload].parent) {
        return {
          ...state,
          operations: initialState.operations,
        };
      }

      return {
        ...state,
        operations: Object.values(state.operations).reduce((acc, operation) => {
          // TODO: remove all children
          if (operation.id === payload && operation.parent) {
            const siblings = getSiblings(state.operations, operation.parent, payload);

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
          return {
            ...acc,
            [operation.id]: operation,
          };
        }, {} as Operations),
      };
    }
    default:
      throw new Error();
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const getValue = <R extends unknown>(callback: UseSelectorCallback): R => {
    return callback(state) as R;
  };

  return (
    <EpicCherryContext.Provider value={{ getValue, dispatch }}>
      <div className="App">
        <section className="App-header">
          <div className="App-variables">
            <VariablesList variables={state.variables} />
          </div>
          <div className="App-operations">
            <OperationsSection operations={state.operations} parentId={null} />
          </div>
          <div>
            <Result
              variables={state.variables}
              operations={state.operations}
              rootId={state.rootNodeID}
            />
          </div>
        </section>
      </div>
    </EpicCherryContext.Provider>
  );
}

export default App;
