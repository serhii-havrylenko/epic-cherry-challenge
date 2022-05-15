import { getVariables, getOperations, getRootNodeId } from '../../selectors';
import { useSelector } from '../../utils';
import { calculateResult } from './calculateResult';

export const Result = () => {
  const variables = useSelector(getVariables);
  const operations = useSelector(getOperations);
  const rootNodeId = useSelector(getRootNodeId);

  const result = calculateResult({ variables, operations, nodeId: rootNodeId });

  return (
    <div>
      Final result is: <strong>{String(result)}</strong>
    </div>
  );
};
