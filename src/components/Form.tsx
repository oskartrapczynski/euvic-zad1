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
} from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { roles } from '../form/roles';
import { regexes } from '../form/regexes';
import { constraints } from '../form/constraints';
import { fields } from '../form/fields';
import { FormInputs } from '../interfaces/form/FormInputs';
import Input from '../components/Input';
import { formContainerStyles, stepperStyles } from '../styles/formStyles';

const { phoneLength, nipLength } = constraints;
const { regexEmail, regexNip, regexPhone } = regexes;
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
    .oneOf([yup.ref('password')], 'Password must be the same')
    .required(),
  nip: yup
    .string()
    .length(nipLength, `NIP must have ${nipLength} numbers`)

    .required(),
  phone: yup.string().length(phoneLength, `must be ${phoneLength} numbers`),
  role: yup.string().required(),
});

const defaultValues = {
  email: '',
  password: '',
  confirmPassword: '',
  nip: '',
  phone: '',
  role: '',
};

const Form = () => {
  const {
    register,
    handleSubmit,
    // watch,
    control,
    reset,
    formState: { errors },
  } = useForm<FormInputs>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    sendPostRequest(data);
    reset();
    setCheck(false);
    setActiveStep(0);
  };

  const [check, setCheck] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [request, setRequest] = useState('');

  const sendPostRequest = async (data: FormInputs) => {
    try {
      const resp = await axios.post('werwer/fwfe', data);
      console.log(resp.data);
      setRequest('success');
    } catch (err) {
      console.error(err);
      setRequest('error');
    }
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
    setCheck((prev) => !prev);
    handleNext();
  };
  const rolesMenu = roles.map((role) => (
    <MenuItem key={role.id} value={role.id}>
      {role.role}
    </MenuItem>
  ));

  const buttonEditCheck = (
    <Button
      type="button"
      variant="contained"
      onClick={check ? handleEditClick : handleCheckClick}
    >
      {check ? 'edit' : 'check'}
    </Button>
  );

  const buttonRegister = (
    <Button type="submit" variant="contained" color="success">
      register
    </Button>
  );

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
      <Box sx={formContainerStyles}>
        <Stepper activeStep={activeStep} sx={stepperStyles}>
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
              disabled={check}
            />

            <Input
              name={fields.password}
              control={control}
              type="password"
              register={register}
              errors={errors}
              label="Password"
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
              disabled={check}
              isShowPassword
            />

            <Input
              name={fields.nip}
              control={control}
              register={register}
              errors={errors}
              label="NIP"
              disabled={check}
              regex={regexNip}
            />

            <Input
              name={fields.phone}
              control={control}
              register={register}
              errors={errors}
              label="Phone *"
              disabled={check}
              regex={regexPhone}
            />

            <Input
              name={fields.role}
              control={control}
              register={register}
              errors={errors}
              label="Role"
              disabled={check}
              select
              children={rolesMenu}
            />

            {buttonEditCheck}
            {check && buttonRegister}
          </Stack>
        </form>
      </Box>
    </>
  );
};

export default Form;
