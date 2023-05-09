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
import { FormInputs } from '../interfaces/form/FormInputs';

interface IProps {
  name: TFieldsValues;
  control: Control<FormInputs, any>;
  type?: string;
  register: UseFormRegister<FormInputs>;
  errors: FieldErrors<FormInputs>;
  select?: boolean;
  label: string;
  disabled: boolean;
  children?: JSX.Element[];
  isShowPassword?: boolean;
  regex?: RegExp;
  inputMode?: string;
}

const Input: FC<IProps> = ({
  name,
  control,
  type,
  register,
  errors,
  select,
  label,
  disabled,
  children,
  isShowPassword,
  regex,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    onChange: (...event: any[]) => void,
    regex?: RegExp
  ) => {
    if (!e.target) {
      return;
    }
    const { value } = e.target;

    if (regex && !regex.test(value)) {
      return;
    }
    onChange(value);
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

  console.log(!!errors[name]);

  const typeInput =
    type === 'password' ? (showPassword ? 'text' : 'password') : type;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, field: { onChange, value } }) => (
        <TextField
          {...field}
          sx={{ width: '100%', borderColor: 'green' }}
          label={label}
          type={typeInput}
          variant="standard"
          {...register(name, { pattern: /[0-9]{3}/ })}
          error={!!errors[name]}
          helperText={errors[name]?.message}
          onChange={(e) => handleChange(e, onChange, regex)}
          disabled={disabled}
          select={select}
          children={children}
          InputProps={{ endAdornment }}
          color={value.length > 0 && !errors[name] ? 'success' : 'primary'}
        />
      )}
    />
  );
};

export default Input;
