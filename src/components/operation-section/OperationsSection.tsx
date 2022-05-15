import { v4 as uuidV4 } from 'uuid';

import { OperationDefinition, Operations } from '../../types';
import { useDispatch, useSelector } from '../../utils';

const hasChildOperations = (id: string, operations: Operations) =>
  Object.values(operations).find(({ parent }) => parent === id);

const LogicalOperation = ({
  operation: { id, type },
  indentation,
}: {
  operation: OperationDefinition;
  indentation: number;
}) => {
  const dispatch = useDispatch();
  const operations = useSelector((state) => state.operations);

  if (!hasChildOperations(id, operations)) {
    console.log('trigger addOperation');
    dispatch({
      type: 'addOperation',
      payload: {
        id: uuidV4(),
        parent: id,
      },
    });
  }

  return (
    <>
      <select
        value={type}
        onChange={(e) =>
          dispatch({
            type: 'selectOperation',
            payload: {
              type: e.target.value as OperationDefinition['type'],
              id,
              value: null,
            },
          })
        }
      >
        <option value="and">and</option>
        <option value="or">or</option>
      </select>
      <OperationsSection operations={operations} indentation={indentation + 20} parentId={id} />
    </>
  );
};

export const OperationsSection = ({
  operations,
  indentation = 0,
  parentId,
}: {
  operations: Operations;
  indentation?: number;
  parentId: string | null;
}) => {
  const dispatch = useDispatch();
  const variables = useSelector((state) =>
    state.variables.map(({ name, id }) => ({ id, name })).filter(({ name }) => !!name),
  );

  return (
    <div>
      <div>
        {Object.values(operations)
          .filter(({ parent }) => parent === parentId)
          .map(({ id, type, value }) => {
            let element!: JSX.Element;
            let children: JSX.Element | null = null;
            if (type === 'select') {
              element = (
                <select
                  value="select"
                  onChange={(e) =>
                    dispatch({
                      type: 'selectOperation',
                      payload: {
                        type: e.target.value as OperationDefinition['type'],
                        id,
                        value: variables[0]?.id ?? null,
                      },
                    })
                  }
                >
                  <option value="select" disabled>
                    select
                  </option>
                  <option value="constant">constant</option>
                  <option value="argument" disabled={variables.length === 0}>
                    argument
                  </option>
                  <option value="and">and</option>
                  <option value="or">or</option>
                </select>
              );
            } else if (type === 'constant') {
              element = (
                <select
                  value={String(value)}
                  onChange={(e) =>
                    dispatch({
                      type: 'setOperationValue',
                      payload: {
                        type: 'constant',
                        value: e.target.value === 'true',
                        id,
                      },
                    })
                  }
                >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              );
            } else if (type === 'argument') {
              element = (
                <select
                  value={String(value)}
                  onChange={(e) =>
                    dispatch({
                      type: 'setOperationValue',
                      payload: {
                        type: 'argument',
                        value: e.target.value,
                        id,
                      },
                    })
                  }
                >
                  {variables.map(({ id: variableId, name }) => (
                    <option key={variableId} value={variableId}>
                      {name}
                    </option>
                  ))}
                </select>
              );
            } else {
              children = (
                <OperationsSection
                  operations={operations}
                  indentation={indentation + 20}
                  parentId={id}
                />
              );

              element = (
                <>
                  <select
                    value={type}
                    onChange={(e) =>
                      dispatch({
                        type: 'selectOperation',
                        payload: {
                          type: e.target.value as OperationDefinition['type'],
                          id,
                          value: null,
                        },
                      })
                    }
                  >
                    <option value="and">and</option>
                    <option value="or">or</option>
                  </select>
                </>
              );
            }

            return (
              <div key={id} style={{ marginLeft: `${indentation}px` }}>
                {element}
                <button
                  onClick={() => {
                    dispatch({
                      type: 'deleteOperation',
                      payload: id,
                    });
                  }}
                >
                  x
                </button>
                {children}
              </div>
            );
          })}
      </div>
      {parentId && (
        <button
          style={{ marginLeft: `${indentation}px` }}
          onClick={() => {
            dispatch({
              type: 'addOperation',
              payload: {
                id: uuidV4(),
                parent: parentId,
              },
            });
          }}
        >
          + add operation
        </button>
      )}
    </div>
  );
};
