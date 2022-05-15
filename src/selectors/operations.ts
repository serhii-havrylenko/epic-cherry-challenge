import { OperationDefinition, Operations, State } from '../types';

export const getOperations = (state: State) => state.operations;

export const getOperationById = (state: State, search: string): OperationDefinition | undefined =>
  getOperations(state)[search];

export const getOperationChildren = (operations: Operations, parentId: string | null) =>
  Object.values(operations).filter(({ parent }) => parent === parentId);

export const getOperationSiblings = (operations: Operations, parentId: string, ownId: string) =>
  Object.values(operations).filter(({ parent, id }) => parent === parentId && id !== ownId);

export const getAllDescendantsOperations = (operations: Operations, id: string) => {
  const descendants: OperationDefinition[] = [];

  const children = getOperationChildren(operations, id);

  descendants.push(...children);
  for (const child of children) {
    descendants.push(...getAllDescendantsOperations(operations, child.id));
  }

  return descendants;
};

export const getRootNodeId = (state: State) => state.rootNodeID;
