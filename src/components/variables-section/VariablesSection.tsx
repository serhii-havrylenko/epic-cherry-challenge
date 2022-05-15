import { v4 as uuidV4 } from 'uuid';

import { getVariables } from '../../selectors';
import { useDispatch, useSelector } from '../../utils';
import { Variable } from './Variable';

export const VariablesList = () => {
  const dispatch = useDispatch();
  const variables = useSelector(getVariables);

  return (
    <div>
      <div>
        {variables.map(({ id, error }) => (
          <Variable
            key={id}
            nameExists={error}
            onValueChange={(value) =>
              dispatch({ type: 'changeVariableValue', payload: { id, value } })
            }
            onNameChange={(name) => dispatch({ type: 'changeVariableName', payload: { id, name } })}
          />
        ))}
      </div>
      <button
        onClick={() =>
          dispatch({
            type: 'addVariable',
            payload: uuidV4(),
          })
        }
      >
        Add variable
      </button>
    </div>
  );
};
