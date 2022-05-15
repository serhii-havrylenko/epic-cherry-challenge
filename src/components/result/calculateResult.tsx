import { getVariableById, getOperationChildren } from '../../selectors';
import { Operations, VariableDefinition } from '../../types';

export const calculateResult = ({
  variables,
  operations,
  nodeId,
}: {
  variables: VariableDefinition[];
  operations: Operations;
  nodeId: string;
}): boolean | undefined => {
  const operation = operations[nodeId];

  if (!operation || operation.type === 'select') {
    return undefined;
  }

  if (operation.type === 'constant') {
    return operation.value;
  } else if (operation.type === 'argument') {
    return getVariableById(variables, operation.value)?.value;
  }

  let value: boolean | undefined;
  const children = getOperationChildren(operations, nodeId);
  for (const child of children) {
    value = calculateResult({ variables, operations, nodeId: child.id });

    if (operation.type === 'and' && !value) {
      return value;
    }

    if (operation.type === 'or' && value) {
      return value;
    }
  }

  return value;
};
