// Actions types

export const LOGIN_BY_PASSWORD = 'loginByPassword';
export const LOGIN_VERIFY = 'loginVerify';
export const GET_USER_COMPANIES = 'getUserCompanies';
export const SELECT_USER_COMPANY = 'selectUserCompany';
export const SEND_FORGOT_PASSWORD_MAIL = 'sendForgotPasswordMail';
export const CHANGE_PASSWORD = 'changePassword';
export const RESET_PASSWORD = 'resetPassword';
export const VALIDATE_RESET_PASSWORD_TOKEN = 'validateResetPasswordToken';
export const LOGOUT = 'logout';
export const CHANGE_EXPIRED_PASSWORD = 'changeExpiredPassword';
export const REFRESH_AUTH_TOKEN = 'refreshToken';
export const LOGIN_VERIFY_SUCCESS = 'loginVerifySuccess';

// Mutations types
export const SET_TEMPORARY_ACCESS_TOKEN = 'setTemporaryAccessToken';
export const SET_TEMPORARY_REFRESH_TOKEN = 'setTemporaryRefreshToken';
export const SET_ACCESS_TOKEN = 'setAccessToken';
export const SET_REFRESH_TOKEN = 'setRefreshToken';
export const SET_TRUST_TOKEN = 'setTrustToken';
export const REMOVE_TRUST_TOKEN = 'removeTrustToken';
export const SET_IS_RECAPTCHA_V2_SHOWN = 'setIsRecaptchaV2Shown';
export const SET_IS_RECAPTCHA_VERIFY_V2_SHOWN = 'setIsRecaptchaVerifyV2Shown';
export const SET_AUTH_DATA = 'setAuthData';
export const SET_AUTH_LOADING = 'setAuthLoading';
export const SET_AUTH_ERROR_MESSAGES = 'setAuthErrorMessages';
export const SET_AUTH_METHOD = 'setAuthMethod';
export const SET_AUTH_SUCCESS_OPERATION = 'setAuthSuccessOperation';
export const SET_LOGIN_ID = 'setLoginId';
export const SET_SHOW_VERIFICATION_CODE_FIELD = 'setShowVerificationCodeField';
export const SET_MASKED_VERIFICATION_METHOD = 'setMaskedVerificationMethod';
export const SET_LOGIN_VERIFY_LOADING = 'setLoginVerifyLoading';
export const SET_AUTH_FORM_ERRORS = 'setAuthFormErrors';
export const SET_AUTH_FORM_LOADING = 'setAuthFormLoading';
export const SET_USER_DETAILS = 'setUserDetails';
export const SET_USER_COMPANIES = 'setUserCompanies';
export const RESET_ALL_STATE = 'resetAllState';
export const SET_IS_PASSWORD_EXPIRED = 'setIsPasswordExpired';

// Getters types
export const IS_USER_LOGGED_IN = 'isUserLoggedIn';
export const ACCESS_TOKEN = 'accessToken';
export const REFRESH_TOKEN = 'refreshToken';
export const TRUST_TOKEN = 'trustToken';
export const TRUST_TOKENS = 'trustTokens';
export const IS_RECAPTCHA_V2_SHOWN = 'isRecaptchaV2Shown';
export const IS_RECAPTCHA_VERIFY_V2_SHOWN = 'isRecaptchaVerifyV2Shown';
export const AUTH_LOADING = 'authLoading';
export const AUTH_ERROR_MESSAGES = 'authErrorMessages';
export const AUTH_METHOD = 'authMethod';
export const AUTH_SUCCESS_OPERATION = 'authSuccessOperation';
export const LOGIN_ID = 'loginId';
export const SHOW_VERIFICATION_CODE_FIELD = 'showVerificationCodeField';
export const MASKED_VERIFICATION_METHOD = 'maskedVerificationMethod';
export const LOGIN_VERIFY_LOADING = 'loginVerifyLoading';
export const AUTH_FORM_ERRORS = 'authFormErrors';
export const AUTH_FORM_LOADING = 'authFormLoading';
export const USER_DETAILS = 'userDetails';
export const USER_COMPANIES = 'userCompanies';
export const IS_PASSWORD_EXPIRED = 'isPasswordExpired';
export const IS_BACKOFFICE_USER = 'isBackofficeUser';
export const ID_NUMBER = 'idNumber';
export const USER_AVATAR = 'userAvatar';
export const ACTIONS = 'actions';
// State
export const AUTH_ACTIONS = 'authActions';
export const TEMPORARY_ACCESS_TOKEN = 'temporaryAccessToken';
export const TEMPORARY_REFRESH_TOKEN = 'temporaryRefreshToken';
export const LOADING = 'loading';
export const ERROR_MESSAGES = 'errorMessages';
export const SUCCESS_OPERATION = 'successOperation';
export const AUTH_ID = 'authId';
export const SHOW_VERIFY_CODE_FIELD = 'showVerifyCodeField';
export const VERIFY_LOADING = 'verifyLoading';
export const FORM_ERRORS = 'formErrors';
export const FORM_LOADING = 'formLoading';
