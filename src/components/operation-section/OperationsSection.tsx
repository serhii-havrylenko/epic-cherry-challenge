import { v4 as uuidV4 } from 'uuid';

import { getOperationChildren, getOperations } from '../../selectors';
import { useDispatch, useSelector } from '../../utils';
import { Operation } from './Operation';

export const OperationsSection = ({
  indentation = 0,
  parentId = null,
}: {
  indentation?: number;
  parentId?: string | null;
}) => {
  const dispatch = useDispatch();
  const operations = useSelector(getOperations);

  return (
    <div>
      <div>
        {getOperationChildren(operations, parentId).map((operation) => {
          return (
            <div key={operation.id} style={{ marginLeft: `${indentation}px` }}>
              <Operation operation={operation} />
              <button
                onClick={() => {
                  dispatch({
                    type: 'deleteOperation',
                    payload: operation.id,
                  });
                }}
              >
                x
              </button>
              {['and', 'or'].includes(operation.type) && (
                <OperationsSection indentation={indentation + 20} parentId={operation.id} />
              )}
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
