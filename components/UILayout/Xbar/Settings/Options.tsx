/* eslint-disable jsx-a11y/no-onchange */
import React, { ReactNode } from 'react';
import { useAppState } from 'components/App/context';

interface Props {
  id: string,
  onChange: React.ChangeEventHandler<HTMLSelectElement>,
  value: string,
  children: ReactNode,
  required?: boolean
}

function Options({
  id, onChange, value, children, required
}: Props) {
  const appState = useAppState();
  const { chotbar } = appState;
  const inactive = ['xhb', 'wxhb', 'exhb'].reduce((collection: number[], key: string) => {
    const inactiveId = key as keyof typeof appState;
    if (inactiveId !== id) return [...collection, appState[inactiveId]];
    return collection;
  }, []);

  return (
    <label htmlFor={id}>
      {children}

      <select
        id={id}
        name={id}
        onChange={onChange}
        value={value}
      >
        { !required && <option value={0}>Off</option> }

        { chotbar && Object.keys(chotbar).map((key, index) => {
          const optValue: number = index + 1;
          return (
            <option
              value={optValue}
              key={key}
              disabled={inactive.includes(optValue)}
            >
              {optValue}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export default Options;
