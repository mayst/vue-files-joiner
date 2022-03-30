import AuthState from '@views/auth/store/types/state';
import {
  RESET_ALL_STATE,
  SET_ACCESS_TOKEN,
  SET_AUTH_DATA,
  SET_AUTH_ERROR_MESSAGES,
  SET_AUTH_FORM_ERRORS,
  SET_AUTH_FORM_LOADING,
  SET_AUTH_LOADING,
  SET_AUTH_METHOD,
  SET_AUTH_SUCCESS_OPERATION,
  SET_IS_PASSWORD_EXPIRED,
  SET_IS_RECAPTCHA_V2_SHOWN,
  SET_IS_RECAPTCHA_VERIFY_V2_SHOWN,
  SET_LOGIN_ID,
  SET_LOGIN_VERIFY_LOADING,
  SET_MASKED_VERIFICATION_METHOD,
  SET_REFRESH_TOKEN,
  SET_SHOW_VERIFICATION_CODE_FIELD,
  SET_TEMPORARY_ACCESS_TOKEN,
  SET_TEMPORARY_REFRESH_TOKEN,
  SET_TRUST_TOKEN,
  SET_USER_COMPANIES,
  SET_USER_DETAILS,
  REMOVE_TRUST_TOKEN,
} from '@views/auth/store/constants';
import { LoginVerifyResp } from '@views/auth/models/login-verify-resp';
import { ErrorResponse } from '@/shared/models/error-response';
import { LoginMethod } from '@views/auth/models/login-method.enum';
import { LoginResp } from '@views/auth/models/login-resp';
import { UserDetailsResp } from '@views/auth/models/user-details-resp';
import { Company } from '@/shared/models/company';
import TrustToken from '@views/auth/models/trust-token';

export type AuthMutations<S = AuthState> = {
  [SET_ACCESS_TOKEN]: (state: S, accessToken: string) => void;
  [SET_REFRESH_TOKEN]: (state: S, refreshToken: string) => void;
  [SET_TRUST_TOKEN]: (state: S, trustToken: TrustToken) => void;
  [SET_TEMPORARY_ACCESS_TOKEN]: (state: S, token: string | null) => void;
  [SET_TEMPORARY_REFRESH_TOKEN]: (state: S, token: string | null) => void;
  [SET_IS_RECAPTCHA_V2_SHOWN]: (state: S, isRecaptchaV2Shown: boolean) => void;
  [SET_IS_RECAPTCHA_VERIFY_V2_SHOWN]: (state: S, isRecaptchaVerifyV2Shown: boolean) => void;
  [SET_AUTH_DATA]: (state: S, response: LoginVerifyResp) => void;
  [SET_AUTH_LOADING]: (state: S, authLoading: boolean) => void;
  [SET_AUTH_ERROR_MESSAGES]: (state: S, errors: ErrorResponse | null) => void;
  [SET_LOGIN_VERIFY_LOADING]: (state: S, loading: boolean) => void;
  [SET_AUTH_FORM_ERRORS]: (state: S, errors: ErrorResponse | null) => void;
  [SET_AUTH_FORM_LOADING]: (state: S, loading: boolean) => void;
  [SET_AUTH_METHOD]: (state: S, authMethod: LoginMethod | null) => void;
  [SET_AUTH_SUCCESS_OPERATION]: (state: S, value: boolean) => void;
  [SET_LOGIN_ID]: (state: S, loginId: string) => void;
  [SET_SHOW_VERIFICATION_CODE_FIELD]: (state: S, showVerificationCodeField: boolean) => void;
  [SET_MASKED_VERIFICATION_METHOD]: (state: S, data: LoginResp) => void;
  [SET_USER_DETAILS]: (state: S, userDetails: UserDetailsResp) => void;
  [SET_USER_COMPANIES]: (state: S, companies: Array<Company> | null) => void;
  [RESET_ALL_STATE]: () => void;
  [SET_IS_PASSWORD_EXPIRED]: (state: S, isPasswordExpired: boolean) => void;
  [REMOVE_TRUST_TOKEN]: (state: S, key: number) => void;
};

export default AuthMutations;
