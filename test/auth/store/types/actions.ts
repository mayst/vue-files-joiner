import AugmentedActionContext from '@/store/types/augmented-action-context';
import AuthState from '@views/auth/store/types/state';
import AuthMutations from '@views/auth/store/types/mutations';
import {
  LOGIN_BY_PASSWORD,
  LOGIN_VERIFY,
  SELECT_USER_COMPANY,
  GET_USER_COMPANIES,
  SEND_FORGOT_PASSWORD_MAIL,
  CHANGE_PASSWORD,
  VALIDATE_RESET_PASSWORD_TOKEN,
  RESET_PASSWORD,
  LOGOUT,
  CHANGE_EXPIRED_PASSWORD,
  LOGIN_VERIFY_SUCCESS,
} from '@views/auth/store/constants';
import { LoginReq } from '@views/auth/models/login-req';
import { LoginVerifyReq } from '@views/auth/models/login-verify-req';
import { BaseAuth } from '@views/auth/models/base-auth';
import { ChangePasswordReq } from '@views/auth/models/change-password-req';
import { ResetPasswordReq } from '@views/auth/models/reset-password-req';
import { ValidateResetPasswordReq } from '@views/auth/models/validate-reset-password-req';
import { LoginVerifyResp } from '@views/auth/models/login-verify-resp';

type AuthAugmentedActionContext = AugmentedActionContext<AuthState, AuthMutations, AuthActions>;

export interface AuthActions {
  [LOGIN_VERIFY_SUCCESS]({ commit, dispatch }: AuthAugmentedActionContext, loginData: LoginVerifyResp): void;
  [LOGIN_BY_PASSWORD]({ commit, dispatch }: AuthAugmentedActionContext, loginData: LoginReq): void;
  [LOGIN_VERIFY]({ commit, dispatch }: AuthAugmentedActionContext, loginVerifyReq: LoginVerifyReq): void;
  [GET_USER_COMPANIES]({ commit }: AuthAugmentedActionContext, loginVerifyReq: LoginVerifyReq): void;
  [SELECT_USER_COMPANY]({ commit, dispatch }: AuthAugmentedActionContext, newIndexNum: number): Promise<LoginVerifyResp>;
  [SEND_FORGOT_PASSWORD_MAIL]({ commit }: AuthAugmentedActionContext, payload: BaseAuth): Promise<void>;
  [CHANGE_PASSWORD]({ commit }: AuthAugmentedActionContext, password: ChangePasswordReq): void;
  [CHANGE_EXPIRED_PASSWORD]({ commit }: AuthAugmentedActionContext, password: ChangePasswordReq): void;
  [RESET_PASSWORD]({ commit }: AuthAugmentedActionContext, resetPasswordData: ResetPasswordReq): void;
  [VALIDATE_RESET_PASSWORD_TOKEN]({ commit }: AuthAugmentedActionContext, validateResetPasswordData: ValidateResetPasswordReq): void;
  [LOGOUT]({ commit, rootState }: AuthAugmentedActionContext): Promise<void>;
}

export default AuthActions;
