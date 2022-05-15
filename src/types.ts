export interface BaseOperationDefinition {
  id: string;
  parent: string | null;
}

export interface ConstantOperationDefinition {
  type: 'constant';
  value: boolean;
}

export interface GenericOperationDefinition {
  type: 'select' | 'argument' | 'or' | 'and';
  value: string | null;
}

export type OperationDefinition = BaseOperationDefinition &
  (ConstantOperationDefinition | GenericOperationDefinition);

export type Operations = Record<string, OperationDefinition>;

export interface VariableDefinition {
  id: string;
  name: string;
  value: boolean;
  error?: boolean;
}

export interface State {
  variables: VariableDefinition[];
  operations: Operations;
  rootNodeID: string;
}

export interface AddVariableAction {
  type: 'addVariable';
  payload: string;
}

export interface ChangeVariableNameAction {
  type: 'changeVariableName';
  payload: {
    id: string;
    name: string;
  };
}

export interface ChangeVariableValueAction {
  type: 'changeVariableValue';
  payload: {
    id: string;
    value: boolean;
  };
}

export interface SelectOperationAction {
  type: 'selectOperation';
  payload: {
    type: OperationDefinition['type'];
    id: string;
    value: string | null;
  };
}

export interface SetOperationValueAction {
  type: 'setOperationValue';
  payload: {
    id: string;
  } & (ConstantOperationDefinition | GenericOperationDefinition);
}

export interface DeleteOperationAction {
  type: 'deleteOperation';
  payload: string;
}

export interface AddOperationAction {
  type: 'addOperation';
  payload: {
    id: string;
    parent: string;
  };
}

export type Actions =
  | AddVariableAction
  | ChangeVariableNameAction
  | ChangeVariableValueAction
  | SelectOperationAction
  | SetOperationValueAction
  | DeleteOperationAction
  | AddOperationAction;

export type UseSelectorCallback<R = unknown> = (state: State) => R;
export type UseSelectorType = <R = unknown>(callback: UseSelectorCallback<R>) => R;
