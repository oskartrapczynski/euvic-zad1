import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button } from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// regex   ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+-=|]).{8,40}$

interface IFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
  nip: string;
  phone: string;
  role: string;
}

const maxPhone = 9;
const maxNip = 10;

const schema = yup.object().shape({
  email: yup.string().email().required(),
  password: yup
    .string()
    .min(8, 'To- short password')
    .matches(/[0-9]/, 'Password requires a number')
    .matches(/[a-z]/, 'Password requires a lowercase letter')
    .matches(/[A-Z]/, 'Password requires a uppercase letter')
    .matches(/[^\w]/, 'Password requires a symbol')
    .required(),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password'), 'Password must be the same'])
    .required(),
  nip: yup
    .string()
    .min(10, 'Too short NIP')
    .max(10, 'Too long NIP')
    .matches(/^[0-9]$/, 'NIP must contains only numbers')
    .required(),
  phone: yup.string().max(9),
  role: yup.string().required(),
});

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => console.log(data);

  const [selectVal, setSelectVal] = useState<number | string>('');
  const [phone, setPhone] = useState('');
  const [nip, setNip] = useState('');

  const roles = [
    { id: 1, role: 'Administrator' },
    { id: 2, role: 'Dyrektor' },
    { id: 3, role: 'Inspektor' },
    { id: 4, role: 'Kierownik' },
    { id: 5, role: 'Księgowy' },
    { id: 6, role: 'Pełnomocnik' },
  ];

  const rolesMenu = roles.map((role) => (
    <MenuItem key={role.id} value={role.id}>
      {role.role}
    </MenuItem>
  ));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.target) {
      setSelectVal(parseInt(e.target.value));
    }
  };

  const handleChangePhone = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const regex = /^[0-9\b]+$/;
    const { value } = e.target;
    if (value === '' || (regex.test(value) && value.length <= maxPhone)) {
      setPhone(value);
    }
  };

  const handleChangeNip = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { value } = e.target;
    const regex = /^[0-9\b]+$/;
    if (value === '' || (regex.test(value) && value.length <= maxNip)) {
      setNip(value);
    }
  };

  // console.log('password:', watch('password')); // watch input value by passing the name of it
  console.log(errors);

  return (
    <>
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* register your input into the hook by invoking the "register" function */}

        <Stack spacing={2} width={400}>
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Email"
                type="email"
                variant="standard"
                {...register('email')}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                variant="standard"
                type="password"
                {...register('password')}
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Password"
                variant="standard"
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
              />
            )}
          />

          <Controller
            name="nip"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="NIP"
                variant="standard"
                {...register('nip')}
                error={!!errors.nip}
                helperText={errors.nip?.message}
                onChange={(e) => handleChangeNip(e)}
                value={nip}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Phone *"
                variant="standard"
                {...register('phone', {
                  required: false,
                  maxLength: 9,
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                onChange={handleChangePhone}
                value={phone}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                {...register('role', { required: 'Role is required' })}
                select
                label="Role"
                onChange={(e) => handleChange(e)}
                value={selectVal}
                error={!!errors.role}
                helperText={errors.role?.message}
              >
                {rolesMenu}
              </TextField>
            )}
          />

          <Button type="submit" variant="contained">
            Submit
          </Button>

          {/* include validation with required or other standard HTML validation rules */}

          {/* <input {...register('exampleRequired', { required: true })} /> */}
          {/* errors will return when field validation fails  */}

          {/* {errors.email && <span>This field is required</span>} */}
        </Stack>
      </form>
    </>
  );
}
