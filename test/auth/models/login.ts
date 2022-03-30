import { LoginMethod } from '@/views/auth/models/login-method.enum';

export interface Login {
  password?: string;
  idNumber: number | null;
  loginMethod: LoginMethod;
  isMobile?: boolean;
  [key: string]: string | boolean | undefined | number | null;
}
