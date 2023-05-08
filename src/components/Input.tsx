import { TextField } from '@mui/material';
import { FC } from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
} from 'react-hook-form';
import { TFieldsValues } from '../form/fields';
import { IFormInputs } from '../interfaces/form/IFormInputs';

interface IProps {
  name: TFieldsValues;
  control: Control<IFormInputs, any>;
  type?: string;
  register: UseFormRegister<IFormInputs>;
  errors: FieldErrors<IFormInputs>;
  select?: boolean;
  label: string;
  value: string;
  disabled: boolean;
  children?: JSX.Element[];
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    regex?: RegExp,
    maxLength?: number
  ) => void;
}

const Input: FC<IProps> = ({
  name,
  control,
  type,
  register,
  errors,
  select,
  label,
  value,
  disabled,
  children,
  handleChange,
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          type={type}
          variant="standard"
          {...register(name)}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          value={value}
          onChange={(e) => handleChange(e)}
          disabled={disabled}
          select={select}
          children={children}
        />
      )}
    />
  );
};

export default Input;
