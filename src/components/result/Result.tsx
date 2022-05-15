import { getVariableById } from '../../selectors';
import { getChildren } from '../../selectors/operations';
import { Operations, VariableDefinition } from '../../types';

const calculateResult = ({
  variables,
  operations,
  nodeId,
}: {
  variables: VariableDefinition[];
  operations: Operations;
  nodeId: string;
}): boolean | undefined => {
  let value: boolean | undefined;

  const operation = operations[nodeId];

  if (!operation || operation.type === 'select') {
    return undefined;
  }

  if (operation.type === 'constant') {
    value = operation.value;
  } else if (operation.type === 'argument') {
    value = getVariableById(variables, operation.value)?.value;
  } else {
    const children = getChildren(operations, nodeId);

    for (const child of children) {
      value = calculateResult({ variables, operations, nodeId: child.id });

      if (operation.type === 'and' && !value) {
        return value;
      }

      if (operation.type === 'or' && value) {
        return value;
      }
    }
  }

  return value;
};

export const Result = ({
  variables,
  operations,
  rootId,
}: {
  variables: VariableDefinition[];
  operations: Operations;
  rootId: string;
}) => {
  const result = calculateResult({ variables, operations, nodeId: rootId });

  return (
    <div>
      Final result is: <strong>{String(result)}</strong>
    </div>
  );
};
