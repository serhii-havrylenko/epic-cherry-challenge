import { OperationDefinition } from '../../types';

export const ConstantOperation = ({
  operation: { value },
  onValueSelect,
}: {
  operation: OperationDefinition;
  onValueSelect: (value: boolean) => void;
}) => {
  return (
    <select value={String(value)} onChange={(e) => onValueSelect(e.target.value === 'true')}>
      <option value="true">true</option>
      <option value="false">false</option>
    </select>
  );
};
