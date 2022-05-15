import { getDefinedVariables } from '../../selectors';
import { OperationDefinition } from '../../types';
import { useSelector } from '../../utils';

export const SelectOperation = ({
  onValueSelect,
}: {
  onValueSelect: (type: OperationDefinition['type']) => void;
}) => {
  const variables = useSelector(getDefinedVariables);

  return (
    <select
      value="select"
      onChange={(e) => onValueSelect(e.target.value as OperationDefinition['type'])}
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
};
