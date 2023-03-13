import { useMemo, memo } from "react";

type FormProps = {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  children: JSX.Element;
};

const Form = memo(({ children, onSubmit }: FormProps) => {
  const child = useMemo(() => children, []);
  return (
    <form onSubmit={onSubmit}>
      {child}
      <button type="submit">Fetch Data</button>
    </form>
  );
});

export default Form;
