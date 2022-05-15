import { OperationDefinition } from '../../types';

export const LogicalOperation = ({
  operation: { type },
  onValueSelect,
}: {
  operation: OperationDefinition;
  onValueSelect: (type: 'and' | 'or') => void;
}) => {
  return (
    <select value={type} onChange={(e) => onValueSelect(e.target.value as 'and' | 'or')}>
      <option value="and">and</option>
      <option value="or">or</option>
    </select>
  );
};
