export const fields = {
  email: 'email',
  password: 'password',
  confirmPassword: 'confirmPassword',
  nip: 'nip',
  phone: 'phone',
  role: 'role',
} as const;

export type TFieldsValues = (typeof fields)[keyof typeof fields];
export type TFieldsTypes = typeof fields;
