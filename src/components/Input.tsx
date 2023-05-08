import { VisibilityOff, Visibility } from '@mui/icons-material';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import { FC, useState } from 'react';
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
  isShowPassword?: boolean;
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
  isShowPassword,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const endAdornment = isShowPassword ? (
    <InputAdornment position="end">
      <IconButton
        aria-label="toggle password visibility"
        onClick={handleClickShowPassword}
        onMouseDown={handleMouseDownPassword}
        edge="end"
      >
        {showPassword ? <VisibilityOff /> : <Visibility />}
      </IconButton>
    </InputAdornment>
  ) : null;

  const typeInput =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <TextField
          sx={{ width: '100%' }}
          {...field}
          label={label}
          type={typeInput}
          variant="standard"
          {...register(name)}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          value={value}
          onChange={(e) => handleChange(e)}
          disabled={disabled}
          select={select}
          children={children}
          InputProps={{
            endAdornment,
          }}
        />
      )}
    />
  );
};

export default Input;
