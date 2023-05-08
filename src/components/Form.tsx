import { useForm, SubmitHandler } from 'react-hook-form';
import {
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Typography,
  Alert,
  AlertTitle,
  MenuItem,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Stack } from '@mui/system';
import { FC, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import axios from 'axios';

import { roles } from '../form/roles';
import { regexes } from '../form/regexes';
import { constraints } from '../form/constraints';
import { fields } from '../form/fields';
import {
  clearForm,
  IFormState,
  setConfirmPassowrd,
  setEmail,
  setNip,
  setPassword,
  setPhone,
  setRole,
} from '../redux/formSlice';
import { useAppSelector } from '../redux/store';
import { IFormInputs } from '../interfaces/form/IFormInputs';
import Input from '../components/Input';

const { phoneLength, nipLength } = constraints;
const { regexEmail, regexNip, regexPhone } = regexes;

// regex   ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+-=|]).{8,40}$

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

const Form = () => {
  const {
    register,
    handleSubmit,
    // watch,
    control,
    formState: { errors },
  } = useForm<IFormInputs>({ resolver: yupResolver(schema) });
  const onSubmit: SubmitHandler<IFormInputs> = (data) => {
    if (check) {
      console.log(data);
      sendPostRequest(data);

      dispatch(clearForm());

      setCheck(false);
      setActiveStep(0);
    }
  };

  const dispatch = useDispatch();
  const { email, password, confirmPassword, nip, phone, role } = useAppSelector(
    (state) => state.form
  );

  const [check, setCheck] = useState(false);

  const [activeStep, setActiveStep] = useState(0);

  const [request, setRequest] = useState('');

  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up('lg'));
  const tablet = useMediaQuery(theme.breakpoints.up('sm'));
  const mobile = useMediaQuery(theme.breakpoints.up('xs'));

  const styles = () => {
    if (desktop) return { width: 500 };
    if (tablet) return { width: 400 };
    if (mobile) return { width: '90%', maxWidth: 400 };
  };

  useEffect(() => {
    console.log('req', request);
  }, [request]);

  const rolesMenu = roles.map((role) => (
    <MenuItem key={role.id} value={role.id}>
      {role.role}
    </MenuItem>
  ));

  const sendPostRequest = async (data: IFormState) => {
    try {
      const resp = await axios.post('werwer/fwfe', data);
      console.log(resp.data);
      setRequest('success');
    } catch (err) {
      // Handle Error Here
      console.error(err);
      setRequest('error');
    }
    console.log(request);
    setTimeout(() => {
      setRequest('');
    }, 4000);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleEditClick = () => {
    setCheck((prev) => !prev);
    handleBack();
  };

  const handleCheckClick = () => {
    if (Object.keys(errors).length > 0) return;
    if (email.length === 0) return;
    if (password.length === 0) return;
    if (confirmPassword.length === 0) return;
    if (nip.length === 0) return;
    if (phone.length === 0) return;
    if (role.length === 0) return;
    setCheck((prev) => !prev);
    handleNext();
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

  // console.log('err:', errors);
  // console.log(!!errors.nip);
  console.log('check', check);

  return (
    <>
      {request === 'error' && (
        <Alert severity="error">
          <AlertTitle>Error</AlertTitle>
          Your registration occured — <strong>error!</strong>
        </Alert>
      )}
      {request === 'sucess' && (
        <Alert severity="success">
          <AlertTitle>Success</AlertTitle>
          You registered — <strong>successfully</strong>
        </Alert>
      )}
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          border: '2px solid #ccc',
          borderRadius: 5,
          p: 5,
          width: styles,
        }}
      >
        <Box sx={{ mb: 5 }}>
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
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Stack spacing={2}>
            {check && (
              <Typography variant="h4" component="h4">
                Is it everything correct ?
              </Typography>
            )}

            <Input
              name={fields.email}
              control={control}
              type="email"
              register={register}
              errors={errors}
              label="Email"
              value={email}
              handleChange={(e) => handleChange(e)}
              disabled={check}
            />

            <Input
              name={fields.password}
              control={control}
              type="password"
              register={register}
              errors={errors}
              label="Password"
              value={password}
              handleChange={(e) => handleChange(e)}
              disabled={check}
              isShowPassword
            />

            <Input
              name={fields.confirmPassword}
              control={control}
              type="password"
              register={register}
              errors={errors}
              label="Confirm Password"
              value={confirmPassword}
              handleChange={(e) => handleChange(e)}
              disabled={check}
              isShowPassword
            />

            <Input
              name={fields.nip}
              control={control}
              register={register}
              errors={errors}
              label="NIP"
              value={nip}
              handleChange={(e) => handleChange(e, regexNip, nipLength)}
              disabled={check}
            />

            <Input
              name={fields.phone}
              control={control}
              register={register}
              errors={errors}
              label="Phone *"
              value={phone}
              handleChange={(e) => handleChange(e, regexPhone, phoneLength)}
              disabled={check}
            />

            <Input
              name={fields.role}
              control={control}
              register={register}
              errors={errors}
              label="Role"
              value={role}
              handleChange={(e) => handleChange(e)}
              disabled={check}
              select
              children={rolesMenu}
            />

            {check ? (
              <Button
                type="button"
                variant="contained"
                onClick={handleEditClick}
              >
                edit
              </Button>
            ) : (
              <Button
                type="button"
                variant="contained"
                onClick={handleSubmit(handleCheckClick)}
              >
                check
              </Button>
            )}
            {check && (
              <Button type="submit" variant="contained" color="success">
                register
              </Button>
            )}
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default Form;
