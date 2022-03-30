import { BaseAuth } from '@views/auth/models/base-auth';

export interface ValidateResetPasswordReq extends BaseAuth {
  resetPwToken: string;
}
