import { useForm, SubmitHandler, Controller } from 'react-hook-form';

import { TextField, FormControl, MenuItem, Button } from '@mui/material';
import { Stack } from '@mui/system';
import { useState } from 'react';

// regex   ^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?\/~_+-=|]).{8,40}$

interface IFormInputs {
  email: string;
  password: string;
  nip: string;
  phone: string;
  role: string;
}

export default function App() {
  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
  } = useForm<IFormInputs>();
  const onSubmit: SubmitHandler<IFormInputs> = (data) => console.log(data);

  const [selectVal, setSelectVal] = useState<number | string>('');

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

  console.log('email:', watch('email')); // watch input value by passing the name of it

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
                {...register('email', {
                  required: 'Email is required',
                  pattern: /^\S+@\S+$/i,
                })}
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
                {...register('password', {
                  required: true,
                  pattern:
                    /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[\]:;<>,.?/~_+-=|]).{8,40}$/i,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                {...register('nip', {
                  required: 'NIP is required',
                  pattern: /^[0-9]{10}$/i,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                  maxLength: 12,
                })}
                error={!!errors.email}
                helperText={errors.email?.message}
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
                error={!!errors.email}
                helperText={errors.email?.message}
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
