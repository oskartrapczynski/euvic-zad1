import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import {
  TextField,
  MenuItem,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
} from '@mui/material';
import { Stack } from '@mui/system';
import { useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';

import { roles } from './form/roles';
import { regexes } from './form/regexes';
import { constraints } from './form/constraints';
import {
  clearForm,
  setConfirmPassowrd,
  setEmail,
  setNip,
  setPassword,
  setPhone,
  setRole,
} from './redux/formSlice';
import { useAppSelector } from './redux/store';

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

const steps = ['Fill form', 'Check form'];

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
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    console.log(data);
  };

  // const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const { email, password, confirmPassword, nip, phone, role } = useAppSelector(
    (state) => state.form
  );

  console.log('email:', email);

  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');
  // const [nip, setNip] = useState('');
  // const [phone, setPhone] = useState('');
  // const [role, setRole] = useState<number | string>('');

  const [edit, setEdit] = useState(true);

  const [activeStep, setActiveStep] = useState(0);

  //redux

  // const {email} = useSelector((state) => state.form)

  const rolesMenu = roles.map((role) => (
    <MenuItem key={role.id} value={role.id}>
      {role.role}
    </MenuItem>
  ));

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleEditClick = () => {
    setEdit((prev) => !prev);
    handleBack();
  };

  const handleSubmitClick = () => {
    if (Object.keys(errors).length > 0) return;
    if (email.length === 0) return;
    if (password.length === 0) return;
    if (confirmPassword.length === 0) return;
    if (nip.length === 0) return;
    if (phone.length === 0) return;
    if (role.length === 0) return;
    setEdit((prev) => !prev);
    handleNext();
  };

  // const handleChangeEmail = (
  //   e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) => {
  //   console.log(e.target.name);
  //   dispatch(setEmail(e.target.value));
  // };

  const handleRegister = () => {
    alert('sent');
    // setEmail('');
    // dispatch(setEmail(''));
    // setPassword('');
    // setConfirmPassword('');
    // setNip('');
    // setPhone('');
    // setRole('');

    dispatch(clearForm());

    setEdit(true);
    setActiveStep(0);
  };

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
      case 'email':
        // setEmail(value);
        dispatch(setEmail(value));
        break;
      case 'password':
        // setPassword(value);
        dispatch(setPassword(value));
        break;
      case 'confirmPassword':
        dispatch(setConfirmPassowrd(value));
        break;
      case 'nip':
        dispatch(setNip(value));
        break;
      case 'phone':
        dispatch(setPhone(value));
        break;
      case 'role':
        dispatch(setRole(value));
        break;
    }
  };

  console.log('err:', errors);
  // console.log(!!errors.nip);

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        border: '2px solid #ccc',
        borderRadius: 5,
        p: 10,
      }}
    >
      <Box width={400} sx={{ mb: 5 }}>
        <Stepper activeStep={activeStep}>
          {steps.map((label) => {
            const stepProps: { completed?: boolean } = {};
            const labelProps: {
              optional?: React.ReactNode;
            } = {};
            return (
              <Step key={label} {...stepProps}>
                <StepLabel {...labelProps}>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
      </Box>
      {/* "handleSubmit" will validate your inputs before invoking "onSubmit" */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {/* register your input into the hook by invoking the "register" function */}

        <Stack spacing={2} width={400}>
          {!edit && (
            <Typography variant="h4" component="h4">
              Is it everything correct ?
            </Typography>
          )}
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
                value={email}
                onChange={(e) => handleChange(e)}
                disabled={!edit}
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
                value={password}
                onChange={(e) => handleChange(e)}
                disabled={!edit}
              />
            )}
          />

          <Controller
            name="confirmPassword"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Confirm Password"
                variant="standard"
                type="password"
                {...register('confirmPassword')}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                value={confirmPassword}
                onChange={(e) => handleChange(e)}
                disabled={!edit}
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
                value={nip}
                onChange={(e) => handleChange(e, regexNip, nipLength)}
                disabled={!edit}
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
                value={phone}
                onChange={(e) => handleChange(e, regexPhone, phoneLength)}
                disabled={!edit}
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
                error={!!errors.role}
                helperText={errors.role?.message}
                value={role}
                onChange={(e) => handleChange(e)}
                disabled={!edit}
              >
                {rolesMenu}
              </TextField>
            )}
          />

          {edit ? (
            <Button
              type="submit"
              variant="contained"
              onClick={handleSubmitClick}
            >
              Submit
            </Button>
          ) : (
            <Button type="button" variant="contained" onClick={handleEditClick}>
              Edit
            </Button>
          )}

          {!edit && (
            <Button
              variant="contained"
              onClick={handleRegister}
              color="success"
            >
              Register
            </Button>
          )}
        </Stack>
      </form>
    </Box>
  );
}
