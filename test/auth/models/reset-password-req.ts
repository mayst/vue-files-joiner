import { LoginReq } from '@views/auth/models/login-req';

export interface ResetPasswordReq extends LoginReq {
  resetPwToken: string;
}
