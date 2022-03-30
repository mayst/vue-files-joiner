import AuthState from '@views/auth/store/types/state';
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  IS_RECAPTCHA_V2_SHOWN,
  AUTH_METHOD,
  AUTH_ERROR_MESSAGES,
  AUTH_LOADING,
  AUTH_SUCCESS_OPERATION,
  LOGIN_ID,
  SHOW_VERIFICATION_CODE_FIELD,
  MASKED_VERIFICATION_METHOD,
  USER_DETAILS,
  LOGIN_VERIFY_LOADING,
  AUTH_FORM_ERRORS,
  AUTH_FORM_LOADING,
  IS_RECAPTCHA_VERIFY_V2_SHOWN,
  USER_COMPANIES,
  IS_USER_LOGGED_IN,
  TRUST_TOKEN,
  IS_PASSWORD_EXPIRED,
  IS_BACKOFFICE_USER,
  ID_NUMBER,
  USER_AVATAR,
  ACTIONS,
  TRUST_TOKENS,
} from '@views/auth/store/constants';
import { ErrorResponse } from '@/shared/models/error-response';
import { UserDetailsResp } from '@views/auth/models/user-details-resp';
import { Company } from '@/shared/models/company';
import { LoginMethod } from '@views/auth/models/login-method.enum';
import { ActionAbility } from '@views/auth/models/action-ability';
import TrustToken from '@views/auth/models/trust-token';

export type AuthGetters<S = AuthState> = {
  [IS_USER_LOGGED_IN](state: S): boolean;
  [ID_NUMBER](state: S): number | null;
  [ACCESS_TOKEN](state: S): string | null;
  [REFRESH_TOKEN](state: S): string | null;
  [TRUST_TOKEN](state: S): (value: number) => string | null;
  [TRUST_TOKENS](state: S): TrustToken;
  [IS_RECAPTCHA_V2_SHOWN](state: S): boolean;
  [IS_RECAPTCHA_VERIFY_V2_SHOWN](state: S): boolean;
  [AUTH_ERROR_MESSAGES](state: S): ErrorResponse | null;
  [AUTH_LOADING](state: S): boolean;
  [LOGIN_VERIFY_LOADING](state: S): boolean;
  [AUTH_FORM_ERRORS](state: S): ErrorResponse | null;
  [AUTH_FORM_LOADING](state: S): boolean;
  [AUTH_METHOD](state: S): LoginMethod;
  [AUTH_SUCCESS_OPERATION](state: S): boolean;
  [LOGIN_ID](state: S): string | null;
  [SHOW_VERIFICATION_CODE_FIELD](state: S): boolean;
  [MASKED_VERIFICATION_METHOD](state: S): string | null;
  [USER_DETAILS](state: S): UserDetailsResp | null;
  [USER_COMPANIES](state: S): Array<Company> | null;
  [IS_PASSWORD_EXPIRED](state: S): boolean;
  [IS_BACKOFFICE_USER](state: S): boolean;
  [USER_AVATAR](state: S): string | null;
  [ACTIONS](state: S): Array<ActionAbility>;
};

export default AuthGetters;
