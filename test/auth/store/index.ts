import { Module } from 'vuex';
import AuthState from '@views/auth/store/types/state';
import { actions } from './actions';
import { getters } from './getters';
import { mutations } from './mutations';
import { RootState } from '@/store';
import { LoginMethod } from '@views/auth/models/login-method.enum';
import {
  ACCESS_TOKEN,
  AUTH_ACTIONS,
  AUTH_ID,
  REFRESH_TOKEN,
  TRUST_TOKEN,
  ERROR_MESSAGES,
  FORM_ERRORS,
  FORM_LOADING,
  LOADING,
  AUTH_METHOD,
  MASKED_VERIFICATION_METHOD,
  IS_PASSWORD_EXPIRED,
  IS_RECAPTCHA_V2_SHOWN,
  IS_RECAPTCHA_VERIFY_V2_SHOWN,
  SHOW_VERIFY_CODE_FIELD,
  SUCCESS_OPERATION,
  TEMPORARY_ACCESS_TOKEN,
  TEMPORARY_REFRESH_TOKEN,
  USER_COMPANIES,
  USER_DETAILS,
  VERIFY_LOADING,
} from './constants';

const initialState = (): AuthState => ({
  [ACCESS_TOKEN]: null,
  [REFRESH_TOKEN]: null,
  [TRUST_TOKEN]: {},
  [TEMPORARY_ACCESS_TOKEN]: null,
  [TEMPORARY_REFRESH_TOKEN]: null,
  [IS_RECAPTCHA_V2_SHOWN]: false,
  [IS_RECAPTCHA_VERIFY_V2_SHOWN]: false,
  [LOADING]: false,
  [ERROR_MESSAGES]: null,
  [AUTH_METHOD]: LoginMethod.SMS,
  [SUCCESS_OPERATION]: false,
  [AUTH_ID]: null,
  [SHOW_VERIFY_CODE_FIELD]: false,
  [MASKED_VERIFICATION_METHOD]: null,
  [VERIFY_LOADING]: false,
  [FORM_ERRORS]: null,
  [FORM_LOADING]: false,
  [USER_DETAILS]: null,
  [USER_COMPANIES]: null,
  [IS_PASSWORD_EXPIRED]: false,
  [AUTH_ACTIONS]: [],
});

export const auth: Module<AuthState, RootState> = {
  getters,
  actions,
  mutations,
  namespaced: true,
  state: initialState(),
};
