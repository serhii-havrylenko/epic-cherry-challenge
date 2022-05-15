import { calculateResult } from './calculateResult';

test('should return undefined if the operation type is select', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'select',
        value: null,
      },
    },
  });

  expect(logicalOpResult).toBeUndefined();
});

test('should return true if the operation type is constant and set to true', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'constant',
        value: true,
      },
    },
  });

  expect(logicalOpResult).toBeTruthy();
});

test('should return false if the operation type is constant and set to false', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'constant',
        value: false,
      },
    },
  });

  expect(logicalOpResult).toBeFalsy();
});

test('should return undefined if type is argument and value is not set', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: true,
      },
    ],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'argument',
        value: null,
      },
    },
  });

  expect(logicalOpResult).toBeUndefined();
});

test('should return the argument value if type is argument', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: true,
      },
    ],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'argument',
        value: 'var1',
      },
    },
  });

  expect(logicalOpResult).toBeTruthy();
});

test('should calculate AND operation correctly for falsy conditions', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: true,
      },
    ],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'and',
        value: null,
      },
      2: {
        id: '2',
        parent: '1',
        type: 'constant',
        value: false,
      },
      3: {
        id: '3',
        parent: '1',
        type: 'argument',
        value: 'var1',
      },
    },
  });

  expect(logicalOpResult).toBeFalsy();
});

test('should calculate AND operation correctly for truthy conditions', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: true,
      },
    ],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'and',
        value: null,
      },
      2: {
        id: '2',
        parent: '1',
        type: 'constant',
        value: true,
      },
      3: {
        id: '3',
        parent: '1',
        type: 'argument',
        value: 'var1',
      },
    },
  });

  expect(logicalOpResult).toBeTruthy();
});

test('should calculate OR operation correctly for falsy conditions', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: false,
      },
    ],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'or',
        value: null,
      },
      2: {
        id: '2',
        parent: '1',
        type: 'constant',
        value: false,
      },
      3: {
        id: '3',
        parent: '1',
        type: 'argument',
        value: 'var1',
      },
    },
  });

  expect(logicalOpResult).toBeFalsy();
});

test('should calculate OR operation correctly for truthy conditions', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: false,
      },
    ],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'or',
        value: null,
      },
      2: {
        id: '2',
        parent: '1',
        type: 'constant',
        value: false,
      },
      3: {
        id: '3',
        parent: '1',
        type: 'argument',
        value: 'var1',
      },
      4: {
        id: '4',
        parent: '1',
        type: 'constant',
        value: true,
      },
    },
  });

  expect(logicalOpResult).toBeTruthy();
});

test('should return undefined if true or false cannot be determined', () => {
  const logicalOpResult = calculateResult({
    nodeId: '1',
    variables: [
      {
        id: 'var1',
        name: 'Var 1',
        value: true,
      },
    ],
    operations: {
      1: {
        id: '1',
        parent: null,
        type: 'and',
        value: null,
      },
      2: {
        id: '2',
        parent: '1',
        type: 'constant',
        value: true,
      },
      3: {
        id: '3',
        parent: '1',
        type: 'argument',
        value: 'var1',
      },
      4: {
        id: '4',
        parent: '1',
        type: 'and',
        value: null,
      },
      5: {
        id: '5',
        parent: '4',
        type: 'constant',
        value: true,
      },
      6: {
        id: '6',
        parent: '4',
        type: 'argument',
        value: null,
      },
    },
  });

  expect(logicalOpResult).toBeUndefined();
});
