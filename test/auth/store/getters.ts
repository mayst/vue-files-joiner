import { GetterTree } from 'vuex';
import { RootState } from '@/store';
import AuthState from '@views/auth/store/types/state';
import AuthGetters from '@views/auth/store/types/getters';
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
  AUTH_ACTIONS,
  LOADING,
  ERROR_MESSAGES,
  SUCCESS_OPERATION,
  AUTH_ID,
  SHOW_VERIFY_CODE_FIELD,
  VERIFY_LOADING,
  FORM_ERRORS,
  FORM_LOADING,
  TRUST_TOKENS,
} from '@views/auth/store/constants';
import { LoginMethod } from '@views/auth/models/login-method.enum';

export const getters: GetterTree<AuthState, RootState> & AuthGetters = {
  [IS_USER_LOGGED_IN](state) {
    return !!state[ACCESS_TOKEN];
  },

  [ID_NUMBER](state) {
    return state[USER_DETAILS]?.idNumber || null;
  },

  [ACCESS_TOKEN](state) {
    return state[ACCESS_TOKEN];
  },

  [REFRESH_TOKEN](state) {
    return state[REFRESH_TOKEN];
  },

  [TRUST_TOKEN]: (state) => (key) => {
    return state[TRUST_TOKEN][key];
  },

  [TRUST_TOKENS]: (state) => {
    return state[TRUST_TOKEN];
  },

  [IS_RECAPTCHA_V2_SHOWN](state) {
    return state[IS_RECAPTCHA_V2_SHOWN];
  },

  [IS_RECAPTCHA_VERIFY_V2_SHOWN](state) {
    return state[IS_RECAPTCHA_VERIFY_V2_SHOWN];
  },

  [AUTH_ERROR_MESSAGES](state) {
    return state[ERROR_MESSAGES];
  },

  [AUTH_LOADING](state) {
    return state[LOADING];
  },

  [LOGIN_VERIFY_LOADING](state) {
    return state[VERIFY_LOADING];
  },

  [AUTH_FORM_ERRORS](state) {
    return state[FORM_ERRORS];
  },

  [AUTH_FORM_LOADING](state) {
    return state[FORM_LOADING];
  },

  [AUTH_METHOD](state) {
    return state[AUTH_METHOD] || LoginMethod.SMS;
  },

  [AUTH_SUCCESS_OPERATION](state) {
    return state[SUCCESS_OPERATION];
  },

  [LOGIN_ID](state) {
    return state[AUTH_ID];
  },

  [SHOW_VERIFICATION_CODE_FIELD](state) {
    return state[SHOW_VERIFY_CODE_FIELD];
  },

  [MASKED_VERIFICATION_METHOD](state) {
    return state[MASKED_VERIFICATION_METHOD];
  },

  [USER_DETAILS](state) {
    return state[USER_DETAILS];
  },

  [USER_COMPANIES](state) {
    return state[USER_COMPANIES];
  },

  [IS_PASSWORD_EXPIRED](state) {
    return state[IS_PASSWORD_EXPIRED];
  },

  [IS_BACKOFFICE_USER](state) {
    return !!state[USER_DETAILS]?.isBackofficeUser;
  },

  [USER_AVATAR](state) {
    return state[USER_DETAILS]?.avatar ? `data:image/png;base64, ${state[USER_DETAILS]?.avatar}` : null;
  },

  [ACTIONS](state) {
    return state[AUTH_ACTIONS];
  },
};
