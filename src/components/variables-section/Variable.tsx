import './Variable.css';

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
    <>
      <div className="Variable">
        <input
          placeholder="Variable name"
          className={nameExists ? 'Variable-hasError' : ''}
          onChange={(e) => onNameChange(e.target.value)}
        />
        <select onChange={(e) => onValueChange(e.target.value === 'true')}>
          <option value="true">true</option>
          <option value="false">false</option>
        </select>
      </div>
      {nameExists && <strong className="Variable-error">* Name already exists</strong>}
    </>
  );
};
