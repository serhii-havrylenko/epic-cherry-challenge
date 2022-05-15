import React from 'react';

function useInput(
  opts: Omit<
    React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'value' | 'onChange'
  >,
) {
  const [value, setValue] = React.useState('');
  const input = <input value={value} onChange={(e) => setValue(e.target.value)} {...opts} />;

  return [value, input];
}

export const Variable = ({
  onValueChange,
  onNameChange,
  nameExists,
}: {
  onValueChange: (value: boolean) => void;
  onNameChange: (name: string) => void;
  nameExists?: boolean;
}) => {
  // const [variableName, variableNameInput] = useInput({ placeholder: 'Variable name' });

  return (
    <div>
      <input placeholder="Variable name" onChange={(e) => onNameChange(e.target.value)} />
      <select onChange={(e) => onValueChange(e.target.value === 'true')}>
        <option value="true">true</option>
        <option value="false">false</option>
      </select>
      {nameExists && <strong className="error">* Name already exists</strong>}
    </div>
  );
};
