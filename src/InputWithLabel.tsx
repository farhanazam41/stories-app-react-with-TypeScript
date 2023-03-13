import React from "react";

type InputProps = {
  label: string;
  value?: string;
  inputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type: string;
};

const InputWithLabel = ({
  label,
  value,
  inputChange,
  type = "text"
}: InputProps) => {
  console.log("input compp");
  return (
    <div>
      <label>{label}</label>
      <input value={value} onChange={inputChange} type={type} />
    </div>
  );
};

export default React.memo(InputWithLabel);
