import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface IFormState {
  email: string;
  password: string;
  confirmPassword: string;
  nip: string;
  phone: string;
  role: string;
}
const initialState: IFormState = {
  email: '',
  password: '',
  confirmPassword: '',
  nip: '',
  phone: '',
  role: '',
};

export const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassowrd: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setNip: (state, action: PayloadAction<string>) => {
      state.nip = action.payload;
    },
    setPhone: (state, action: PayloadAction<string>) => {
      state.phone = action.payload;
    },
    setRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    clearForm: (state) => {
      state.email = '';
      state.password = '';
      state.confirmPassword = '';
      state.nip = '';
      state.phone = '';
      state.role = '';
    },
  },
});

export const {
  setEmail,
  setPassword,
  setConfirmPassowrd,
  setNip,
  setPhone,
  setRole,
  clearForm,
} = formSlice.actions;

export default formSlice;
