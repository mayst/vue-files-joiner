import { ErrorResponse } from '@/shared/models/error-response';
import { LoginMethod } from '@views/auth/models/login-method.enum';
import { UserDetailsResp } from '@views/auth/models/user-details-resp';
import { Company } from '@/shared/models/company';
import {
  AUTH_ACTIONS,
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TRUST_TOKEN,
  TEMPORARY_ACCESS_TOKEN,
  TEMPORARY_REFRESH_TOKEN,
  IS_RECAPTCHA_V2_SHOWN,
  IS_RECAPTCHA_VERIFY_V2_SHOWN,
  LOADING,
  ERROR_MESSAGES,
  AUTH_METHOD,
  SUCCESS_OPERATION,
  AUTH_ID,
  SHOW_VERIFY_CODE_FIELD,
  VERIFY_LOADING,
  FORM_ERRORS,
  FORM_LOADING,
  USER_DETAILS,
  USER_COMPANIES,
  IS_PASSWORD_EXPIRED,
  MASKED_VERIFICATION_METHOD,
} from '@views/auth/store/constants';
import { ActionAbility } from '@views/auth/models/action-ability';
import TrustToken from '@views/auth/models/trust-token';

export interface AuthState {
  [ACCESS_TOKEN]: string | null;
  [REFRESH_TOKEN]: string | null;
  [TRUST_TOKEN]: TrustToken;
  [TEMPORARY_ACCESS_TOKEN]: string | null;
  [TEMPORARY_REFRESH_TOKEN]: string | null;
  [IS_RECAPTCHA_V2_SHOWN]: boolean;
  [IS_RECAPTCHA_VERIFY_V2_SHOWN]: boolean;
  [LOADING]: boolean;
  [ERROR_MESSAGES]: ErrorResponse | null;
  [AUTH_METHOD]: LoginMethod | null;
  [SUCCESS_OPERATION]: boolean;
  [AUTH_ID]: string | null;
  [SHOW_VERIFY_CODE_FIELD]: boolean;
  [MASKED_VERIFICATION_METHOD]: string | null;
  [VERIFY_LOADING]: boolean;
  [FORM_ERRORS]: ErrorResponse | null;
  [FORM_LOADING]: boolean;
  [USER_DETAILS]: UserDetailsResp | null;
  [USER_COMPANIES]: Array<Company> | null;
  [IS_PASSWORD_EXPIRED]: boolean;
  [AUTH_ACTIONS]: Array<ActionAbility>;
}

export default AuthState;
