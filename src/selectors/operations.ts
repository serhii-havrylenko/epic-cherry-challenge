import { OperationDefinition, Operations } from '../types';

export const getOperationById = (
  operations: Operations,
  search: string,
): OperationDefinition | undefined => operations[search];

export const getChildren = (operations: Operations, parentId: string) =>
  Object.values(operations).filter(({ parent }) => parent === parentId);

export const getSiblings = (operations: Operations, parentId: string, ownId: string) =>
  Object.values(operations).filter(({ parent, id }) => parent === parentId && id !== ownId);
