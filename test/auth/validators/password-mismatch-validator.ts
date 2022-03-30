import { extend } from 'vee-validate';

export default (): void => {
  return extend('passwords_mismatch', {
    params: ['newPassword'],
    validate: (confirmedPassword: string, { newPassword }: any) => {
      return confirmedPassword === newPassword;
    },
  });
};
