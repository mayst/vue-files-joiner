import { MutationTree } from 'vuex';
import { resetState } from '@/store';
import AuthState from '@views/auth/store/types/state';
import AuthMutations from '@views/auth/store/types/mutations';
import {
  AUTH_ACTIONS,
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
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  TRUST_TOKEN,
  TEMPORARY_ACCESS_TOKEN,
  TEMPORARY_REFRESH_TOKEN,
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
  MASKED_VERIFICATION_METHOD,
  IS_RECAPTCHA_V2_SHOWN,
  IS_RECAPTCHA_VERIFY_V2_SHOWN,
  IS_PASSWORD_EXPIRED,
  REMOVE_TRUST_TOKEN,
} from '@views/auth/store/constants';
import { LoginMethod } from '@views/auth/models/login-method.enum';

export const mutations: MutationTree<AuthState> & AuthMutations = {
  [SET_ACCESS_TOKEN]: (state, accessToken) => {
    state[ACCESS_TOKEN] = accessToken;
  },

  [SET_REFRESH_TOKEN]: (state, refreshToken) => {
    state[REFRESH_TOKEN] = refreshToken;
  },

  [SET_TRUST_TOKEN]: (state, trustToken) => {
    state[TRUST_TOKEN] = { ...state[TRUST_TOKEN], ...trustToken };
  },

  [SET_TEMPORARY_ACCESS_TOKEN]: (state, token) => {
    state[TEMPORARY_ACCESS_TOKEN] = token;
  },

  [SET_TEMPORARY_REFRESH_TOKEN]: (state, token) => {
    state[TEMPORARY_REFRESH_TOKEN] = token;
  },

  [SET_IS_RECAPTCHA_V2_SHOWN]: (state, isRecaptchaV2Shown) => {
    state[IS_RECAPTCHA_V2_SHOWN] = isRecaptchaV2Shown;
  },

  [SET_IS_RECAPTCHA_VERIFY_V2_SHOWN]: (state, isRecaptchaVerifyV2Shown) => {
    state[IS_RECAPTCHA_VERIFY_V2_SHOWN] = isRecaptchaVerifyV2Shown;
  },

  [SET_AUTH_DATA]: (state, response) => {
    state[AUTH_ACTIONS] = (response?.actions || []).map((action: string) => ({ action }));
    state[USER_DETAILS] = { ...response.userDetails, isBackofficeUser: response.isBackofficeUser };
  },

  [SET_AUTH_LOADING]: (state, authLoading) => {
    state[LOADING] = authLoading;
  },

  [SET_AUTH_ERROR_MESSAGES]: (state, errors) => {
    state[ERROR_MESSAGES] = errors;
  },

  [SET_LOGIN_VERIFY_LOADING]: (state, loading) => {
    state[VERIFY_LOADING] = loading;
  },

  [SET_AUTH_FORM_ERRORS]: (state, errors) => {
    state[FORM_ERRORS] = errors;
  },

  [SET_AUTH_FORM_LOADING]: (state, loading) => {
    state[FORM_LOADING] = loading;
  },

  [SET_AUTH_METHOD]: (state, authMethod) => {
    state[AUTH_METHOD] = authMethod;
  },

  [SET_AUTH_SUCCESS_OPERATION]: (state, value) => {
    state[SUCCESS_OPERATION] = value;
  },

  [SET_LOGIN_ID]: (state, loginId) => {
    state[AUTH_ID] = loginId;
  },

  [SET_SHOW_VERIFICATION_CODE_FIELD]: (state, showVerificationCodeField) => {
    state[SHOW_VERIFY_CODE_FIELD] = showVerificationCodeField;
  },

  [SET_MASKED_VERIFICATION_METHOD]: (state, data) => {
    switch (state[AUTH_METHOD]) {
      case LoginMethod.SMS:
        state[MASKED_VERIFICATION_METHOD] = data.maskedPhoneNum || null;
        break;
      case LoginMethod.EMAIL:
        state[MASKED_VERIFICATION_METHOD] = data.maskedEmailAddress || null;
        break;
      default:
        state[MASKED_VERIFICATION_METHOD] = null;
        break;
    }
  },

  [SET_USER_DETAILS]: (state, userDetails) => {
    state[USER_DETAILS] = userDetails;
  },

  [SET_USER_COMPANIES]: (state, companies) => {
    state[USER_COMPANIES] = companies;
  },

  [RESET_ALL_STATE](): void {
    resetState();
  },

  [SET_IS_PASSWORD_EXPIRED]: (state, isPasswordExpired) => {
    state[IS_PASSWORD_EXPIRED] = isPasswordExpired;
  },

  [REMOVE_TRUST_TOKEN]: (state, key) => {
    if (`${key}` in state[TRUST_TOKEN]) {
      delete state[TRUST_TOKEN][key];
    }
  },
};
