import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { TextField, MenuItem, Button } from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { roles } from './form/roles';
import { regexes } from './form/regexes';
import { constraints } from './form/constraints';

const { phoneLength, nipLength } = constraints;
const { regexEmail, regexNip, regexPhone } = regexes;

// regex   ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+-=|]).{8,40}$

interface IFormInputs {
  email: string;
  password: string;
  confirmPassword: string;
  nip: string;
  phone: string;
  role: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .matches(/[@]/, 'email must contains @')
    .matches(/[.]/, 'email must contains .')
    .matches(regexEmail, 'email must be valid')
    .required(),
  password: yup
    .string()
    .min(8, 'Too short password')
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
    .length(nipLength, `NIP must have ${nipLength} numbers`)

    .required(),
  phone: yup.string().length(phoneLength, `must be ${phoneLength} numbers`),
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

  const [role, setRole] = useState<number | string>('');
  const [phone, setPhone] = useState('');
  const [nip, setNip] = useState('');

  const [edit, setEdit] = useState(true);

  const rolesMenu = roles.map((role) => (
    <MenuItem key={role.id} value={role.id}>
      {role.role}
    </MenuItem>
  ));

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    regex?: RegExp,
    maxLength?: number
  ) => {
    if (!e.target) {
      return;
    }
    const { value } = e.target;

    if (maxLength && value.length > maxLength) {
      return;
    }

    if (regex && !regex.test(value)) {
      return;
    }

    switch (e.target.name) {
      case 'nip':
        setNip(value);
        break;
      case 'role':
        setRole(value);
        break;
      case 'phone':
        setPhone(value);
        break;
    }
  };

  // const handleChangePhone = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   const regex = /^[0-9\b]+$/;
  //   const { value } = e.target;
  //   if (value === '' || (regex.test(value) && value.length <= phoneLength)) {
  //     setPhone(value);
  //   }
  // };

  // const handleChangeNip = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   console.log(e);
  //   const { value } = e.target;
  //   const regex = /^[0-9\b]+$/;
  //   if (value === '' || (regex.test(value) && value.length <= NipLength)) {
  //     setNip(value);
  //   }
  // };

  // console.log('password:', watch('password')); // watch input value by passing the name of it
  console.log('err:', errors);
  console.log(!!errors.nip);

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
                onChange={(e) => handleChange(e, regexEmail)}
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
                onChange={(e) => handleChange(e, regexNip, nipLength)}
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
                {...register('phone')}
                error={!!errors.phone}
                helperText={errors.phone?.message}
                onChange={(e) => handleChange(e, regexPhone, phoneLength)}
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
                {...register('role')}
                select
                label="Role"
                onChange={(e) => handleChange(e)}
                value={role}
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
