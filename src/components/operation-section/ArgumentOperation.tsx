import { getDefinedVariables } from '../../selectors';
import { OperationDefinition } from '../../types';
import { useSelector } from '../../utils';

export const ArgumentOperation = ({
  operation: { value },
  onValueSelect,
}: {
  operation: OperationDefinition;
  onValueSelect: (value: string | null) => void;
}) => {
  const variables = useSelector(getDefinedVariables);

  return (
    <select
      value={String(value)}
      onChange={(e) => onValueSelect(e.target.value === 'null' ? null : e.target.value)}
    >
      <option value="null"></option>
      {variables.map(({ id: variableId, name }) => (
        <option key={variableId} value={variableId}>
          {name}
        </option>
      ))}
    </select>
  );
};
