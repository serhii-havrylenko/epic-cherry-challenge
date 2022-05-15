import { VariableDefinition } from '../types';

export const getVariableByName = (
  variables: VariableDefinition[],
  search: string,
): VariableDefinition | undefined => variables.find(({ name }) => name === search);

export const getVariableById = (
  variables: VariableDefinition[],
  search: string | null,
): VariableDefinition | undefined => variables.find(({ id }) => id === search);
