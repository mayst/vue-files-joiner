import { ActionTree } from 'vuex';
import router from '@/router';
import { container } from 'tsyringe';
import eventBus from '@helpers/eventBus';
import { RootState } from '@/store';
import AuthState from '@views/auth/store/types/state';
import AuthActions from '@views/auth/store/types/actions';
import AuthApiService from '@views/auth/services/auth-api.service';
import {
  SET_AUTH_METHOD,
  SET_IS_RECAPTCHA_V2_SHOWN,
  LOGIN_BY_PASSWORD,
  LOGIN_VERIFY,
  SET_AUTH_LOADING,
  SET_AUTH_ERROR_MESSAGES,
  SET_LOGIN_ID,
  SET_SHOW_VERIFICATION_CODE_FIELD,
  SET_MASKED_VERIFICATION_METHOD,
  SET_TEMPORARY_ACCESS_TOKEN,
  SET_TEMPORARY_REFRESH_TOKEN,
  SET_LOGIN_VERIFY_LOADING,
  SET_ACCESS_TOKEN,
  SET_REFRESH_TOKEN,
  SET_IS_RECAPTCHA_VERIFY_V2_SHOWN,
  SELECT_USER_COMPANY,
  GET_USER_COMPANIES,
  SET_USER_COMPANIES,
  SET_AUTH_FORM_LOADING,
  SET_AUTH_FORM_ERRORS,
  SET_AUTH_SUCCESS_OPERATION,
  SEND_FORGOT_PASSWORD_MAIL,
  CHANGE_PASSWORD,
  VALIDATE_RESET_PASSWORD_TOKEN,
  RESET_PASSWORD,
  LOGOUT,
  RESET_ALL_STATE,
  CHANGE_EXPIRED_PASSWORD,
  SET_TRUST_TOKEN,
  SET_IS_PASSWORD_EXPIRED,
  SET_AUTH_DATA,
  LOGIN_VERIFY_SUCCESS,
  TEMPORARY_ACCESS_TOKEN,
  IS_PASSWORD_EXPIRED,
} from '@views/auth/store/constants';
import { LoginResp } from '@views/auth/models/login-resp';
import { LoginVerifyResp } from '@views/auth/models/login-verify-resp';
import { OPEN_USER_COMPANIES_MODAL, CLOSE_USER_COMPANIES_MODAL, OPEN_LOGIN_FAILED_MODAL, OPEN_TOTP_DISABLED_MODAL } from '@views/auth/constants';
import { CLOSE_CHANGE_PASSWORD_MODAL } from '@views/settings/account/constants';
import Vue from 'vue';
import i18n from '@/plugins/i18n';
import { StoreNamespace } from '@/store/store-namespace';
import { GET_COMPANY_LOGO } from '@views/settings/account/store/constants';
import MainMenuRoutesMap from '@layouts/main-menu/main-menu-routes-map';
import { Route } from 'vue-router';
import { GET_AUTHORIZED_MODULES } from '@/store/customers/constants';

export const RECAPTCHA_LOW_SCORE_ERROR_CODE = 104;
export const TOTP_IS_NOT_ENABLED_ERROR_CODE = 106;

const authApiService = container.resolve(AuthApiService);

export const redirectToHome = (): Promise<Route> => router.push({ name: MainMenuRoutesMap.HOME });

export const actions: ActionTree<AuthState, RootState> & AuthActions = {
  [LOGIN_VERIFY_SUCCESS]: async ({ commit, dispatch }, data) => {
    commit(SET_AUTH_DATA, data);

    if (data.trustToken) {
      commit(SET_TRUST_TOKEN, { [data?.userDetails.idNumber]: data.trustToken });
    }

    if (data.hasMultipleCompanies) {
      if (data.isPasswordExpired) {
        commit(SET_IS_PASSWORD_EXPIRED, data.isPasswordExpired);
      }

      commit(SET_TEMPORARY_ACCESS_TOKEN, data.accessToken);
      commit(SET_TEMPORARY_REFRESH_TOKEN, data.refreshToken);
      await dispatch(GET_USER_COMPANIES);
      eventBus.$emit(OPEN_USER_COMPANIES_MODAL);

      return;
    }

    commit(SET_ACCESS_TOKEN, data.accessToken);
    commit(SET_REFRESH_TOKEN, data.refreshToken);

    await Promise.all([
      dispatch(`${StoreNamespace.ACCOUNT_MODULE}/${GET_COMPANY_LOGO}`, {}, { root: true }),
      dispatch(`${StoreNamespace.CUSTOMERS_MODULE}/${GET_AUTHORIZED_MODULES}`, {}, { root: true }),
    ]);

    if (data.isPasswordExpired) {
      await router.push({ name: 'password_expired' });
      commit(SET_LOGIN_VERIFY_LOADING, false);

      return;
    }

    await redirectToHome();

    commit(SET_AUTH_LOADING, false);
    commit(SET_LOGIN_VERIFY_LOADING, false);
    commit(SET_SHOW_VERIFICATION_CODE_FIELD, false);
    commit(SET_LOGIN_ID, undefined);
  },

  [LOGIN_BY_PASSWORD]: async ({ commit, dispatch }, loginData) => {
    commit(SET_AUTH_ERROR_MESSAGES, null);
    try {
      const data: LoginResp | LoginVerifyResp = await authApiService.loginByPassword(loginData);
      const verifyRespData: LoginVerifyResp = data as unknown as LoginVerifyResp;

      if (verifyRespData.trustToken) {
        await dispatch(LOGIN_VERIFY_SUCCESS, verifyRespData);

        return;
      }

      commit(SET_AUTH_LOADING, false);
      commit(SET_AUTH_METHOD, loginData.loginMethod);
      commit(SET_SHOW_VERIFICATION_CODE_FIELD, true);
      commit(SET_LOGIN_ID, (data as LoginResp).id);
      commit(SET_MASKED_VERIFICATION_METHOD, data);
      commit(SET_IS_RECAPTCHA_V2_SHOWN, false);
    } catch (error: any) {
      commit(SET_AUTH_LOADING, false);

      if (!error) {
        return;
      }

      if (error.id) {
        commit(SET_LOGIN_ID, error.id);
      }

      if (error.errorCode === TOTP_IS_NOT_ENABLED_ERROR_CODE) {
        eventBus.$emit(OPEN_TOTP_DISABLED_MODAL);

        return;
      }

      if (error.isBeforeLock) {
        eventBus.$emit(OPEN_LOGIN_FAILED_MODAL);

        return;
      }

      if (error.errorCode === RECAPTCHA_LOW_SCORE_ERROR_CODE) {
        commit(SET_IS_RECAPTCHA_V2_SHOWN, true);
      } else {
        commit(SET_AUTH_ERROR_MESSAGES, error);
      }
    }
  },

  [LOGIN_VERIFY]: async ({ commit, dispatch }, loginVerifyReq) => {
    commit(SET_AUTH_ERROR_MESSAGES, null);
    commit(SET_IS_RECAPTCHA_VERIFY_V2_SHOWN, false);

    try {
      const data: LoginVerifyResp = await authApiService.loginVerify(loginVerifyReq);
      await dispatch(LOGIN_VERIFY_SUCCESS, data);
    } catch (error: any) {
      commit(SET_LOGIN_VERIFY_LOADING, false);

      if (error.errorCode === RECAPTCHA_LOW_SCORE_ERROR_CODE) {
        commit(SET_IS_RECAPTCHA_VERIFY_V2_SHOWN, true);
      } else {
        commit(SET_AUTH_ERROR_MESSAGES, error);
      }
    }
  },

  [GET_USER_COMPANIES]: async ({ commit, state }) => {
    try {
      commit(SET_AUTH_ERROR_MESSAGES, null);
      const { companies } = await authApiService.getUserCompanies(state[TEMPORARY_ACCESS_TOKEN]);

      commit(SET_USER_COMPANIES, companies);
      eventBus.$emit(OPEN_USER_COMPANIES_MODAL);
    } catch (error: any) {
      commit(SET_AUTH_ERROR_MESSAGES, error);
    } finally {
      commit(SET_LOGIN_VERIFY_LOADING, false);
    }
  },

  [SELECT_USER_COMPANY]: async ({ commit, state, dispatch }, newIndexNum) => {
    const response = await authApiService.selectUserCompany({ newIndexNum, token: state[TEMPORARY_ACCESS_TOKEN] });
    commit(SET_TEMPORARY_ACCESS_TOKEN, null);
    commit(SET_TEMPORARY_REFRESH_TOKEN, null);
    commit(SET_ACCESS_TOKEN, response.accessToken);
    commit(SET_REFRESH_TOKEN, response.refreshToken);
    commit(SET_AUTH_DATA, response);

    eventBus.$emit(CLOSE_USER_COMPANIES_MODAL);

    await Promise.all([
      dispatch(`${StoreNamespace.ACCOUNT_MODULE}/${GET_COMPANY_LOGO}`, {}, { root: true }),
      dispatch(`${StoreNamespace.CUSTOMERS_MODULE}/${GET_AUTHORIZED_MODULES}`, {}, { root: true }),
    ]);

    if (state[IS_PASSWORD_EXPIRED]) {
      await router.push({ name: 'password_expired' });
      commit(SET_LOGIN_VERIFY_LOADING, false);
      commit(SET_IS_PASSWORD_EXPIRED, false);
    } else {
      await redirectToHome();
    }

    return response;
  },

  [SEND_FORGOT_PASSWORD_MAIL]: async ({ commit }, payload) => {
    commit(SET_AUTH_FORM_LOADING, true);
    commit(SET_IS_RECAPTCHA_V2_SHOWN, false);
    commit(SET_AUTH_FORM_ERRORS, null);

    try {
      await authApiService.sendForgotPasswordMail(payload);
      commit(SET_AUTH_SUCCESS_OPERATION, true);
    } catch (error: any) {
      if (error.errorCode === RECAPTCHA_LOW_SCORE_ERROR_CODE) {
        commit(SET_IS_RECAPTCHA_V2_SHOWN, true);
      } else {
        commit(SET_AUTH_FORM_ERRORS, error);
      }
    } finally {
      commit(SET_AUTH_FORM_LOADING, false);
    }
  },

  [CHANGE_PASSWORD]: async ({ commit }, password) => {
    commit(SET_AUTH_LOADING, true);
    commit(SET_AUTH_ERROR_MESSAGES, null);

    try {
      await authApiService.changePassword(password);
      commit(SET_AUTH_SUCCESS_OPERATION, true);
      eventBus.$emit(CLOSE_CHANGE_PASSWORD_MODAL);
      Vue.prototype.$toast.error(i18n.t('AUTH.PASSWORD_CHANGED') as string);
    } catch (error: any) {
      commit(SET_AUTH_ERROR_MESSAGES, error.messages);
    } finally {
      commit(SET_AUTH_LOADING, false);
    }
  },

  [CHANGE_EXPIRED_PASSWORD]: async ({ commit }, password) => {
    commit(SET_AUTH_LOADING, true);
    commit(SET_AUTH_ERROR_MESSAGES, null);

    try {
      await authApiService.changePassword(password);
      commit(SET_AUTH_SUCCESS_OPERATION, true);
    } catch (error: any) {
      commit(SET_AUTH_ERROR_MESSAGES, error.messages);
    } finally {
      commit(SET_AUTH_LOADING, false);
    }
  },

  [RESET_PASSWORD]: async ({ commit }, resetPasswordData) => {
    commit(SET_AUTH_LOADING, true);
    commit(SET_AUTH_ERROR_MESSAGES, null);

    try {
      await authApiService.resetPassword(resetPasswordData);
      commit(SET_AUTH_SUCCESS_OPERATION, true);
    } catch (error: any) {
      if (error.errorCode === RECAPTCHA_LOW_SCORE_ERROR_CODE) {
        commit(SET_IS_RECAPTCHA_VERIFY_V2_SHOWN, true);

        return;
      }
      commit(SET_AUTH_ERROR_MESSAGES, error.messages);
    } finally {
      commit(SET_AUTH_LOADING, false);
    }
  },

  [VALIDATE_RESET_PASSWORD_TOKEN]: async ({ commit }, validateResetPasswordData) => {
    commit(SET_AUTH_FORM_LOADING, true);

    try {
      await authApiService.validateResetPasswordToken(validateResetPasswordData);
    } catch (error: any) {
      await router.push({ name: 'not-found' });
    } finally {
      commit(SET_AUTH_FORM_LOADING, false);
    }
  },

  [LOGOUT]: async ({ commit }) => {
    authApiService.logout();
    commit(RESET_ALL_STATE);
    await router.push({ name: 'login' });
  },
};
