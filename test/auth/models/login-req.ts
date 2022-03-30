import { Login } from '@/views/auth/models/login';

export interface LoginReq extends Login {
  recaptchaResponse?: string;
  recaptchaV2Response?: string;
  trustToken?: string | null;
  id?: string | null;
  appVersion?: string;
}
