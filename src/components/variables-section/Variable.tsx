export const Variable = ({
  onValueChange,
  onNameChange,
  nameExists,
}: {
  onValueChange: (value: boolean) => void;
  onNameChange: (name: string) => void;
  nameExists?: boolean;
}) => {
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
