import { LoginReq } from '@/views/auth/models/login-req';

export interface LoginVerifyReq extends LoginReq {
  id: string | null;
  otpCode: string;
  trustDevice: boolean;
}
