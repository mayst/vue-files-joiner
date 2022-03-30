import Vue from 'vue';
import {
  AUTH_METHOD,
  MASKED_VERIFICATION_METHOD,
  SET_AUTH_LOADING,
  SET_LOGIN_VERIFY_LOADING,
  LOGIN_VERIFY,
  IS_RECAPTCHA_V2_SHOWN,
  LOGIN_ID,
  LOGIN_VERIFY_LOADING,
  LOGIN_BY_PASSWORD,
  AUTH_LOADING,
  IS_RECAPTCHA_VERIFY_V2_SHOWN,
  SET_SHOW_VERIFICATION_CODE_FIELD,
  SET_AUTH_ERROR_MESSAGES,
} from '@views/auth/store/constants';
import { LoginMethod } from '@views/auth/models/login-method.enum';
import { RecaptchaActionType } from '@/views/auth/models/recaptcha-action-type.enum';
import { Login } from '@/views/auth/models/login';
import VueRecaptcha from 'vue-recaptcha';
import i18n from '@/plugins/i18n';

import { defineComponent, onBeforeUnmount, onMounted, PropType, ref } from '@vue/composition-api';
import OtpFieldComponent from '@/components/fields/otp-field/otp-field.component';
import useAuthStore from '@views/auth/composables/use-auth-store';

const recaptchaV2SiteKey: string | undefined = process.env.VUE_APP_RECAPTCHA_V2_SITE_KEY;

const zeroPadded = (num: string | number): string | number => {
  return num < 10 ? `0${num}` : num;
};

export default defineComponent({
  components: {
    VueRecaptcha,
  },
  props: {
    loginPayload: {
      type: Object as PropType<Login>,
      required: true,
    },
  },
  setup(props) {
    const { useActions, useMutations, useGetters } = useAuthStore();

    const { [LOGIN_VERIFY]: loginVerifyAction, [LOGIN_BY_PASSWORD]: loginByPasswordAction } = useActions([LOGIN_VERIFY, LOGIN_BY_PASSWORD]);

    const {
      [SET_LOGIN_VERIFY_LOADING]: setLoginVerifyLoading,
      [SET_AUTH_LOADING]: setAuthLoading,
      [SET_SHOW_VERIFICATION_CODE_FIELD]: setShowVerificationCodeField,
      [SET_AUTH_ERROR_MESSAGES]: setAuthErrorMessages,
    } = useMutations([SET_LOGIN_VERIFY_LOADING, SET_AUTH_LOADING, SET_SHOW_VERIFICATION_CODE_FIELD, SET_AUTH_ERROR_MESSAGES]);

    const {
      [MASKED_VERIFICATION_METHOD]: maskedVerificationMethod,
      [AUTH_METHOD]: authMethod,
      [IS_RECAPTCHA_V2_SHOWN]: isRecaptchaV2Shown,
      [IS_RECAPTCHA_VERIFY_V2_SHOWN]: isRecaptchaVerifyV2Shown,
      [LOGIN_ID]: loginId,
      [LOGIN_VERIFY_LOADING]: loginVerifyLoading,
      [AUTH_LOADING]: authLoading,
    } = useGetters([
      MASKED_VERIFICATION_METHOD,
      AUTH_METHOD,
      IS_RECAPTCHA_VERIFY_V2_SHOWN,
      IS_RECAPTCHA_V2_SHOWN,
      LOGIN_ID,
      LOGIN_VERIFY_LOADING,
      AUTH_LOADING,
    ]);

    const authMethods = ref(LoginMethod);
    const verificationCode = ref('');
    const showChangeMethod = ref(false);
    const loginMethod = ref<LoginMethod>(LoginMethod.SMS);
    const doesRecaptchaV2HaveError = ref(false);
    const doesRecaptchaVerifyV2HaveError = ref(false);
    const trustDevice = ref(false);
    const recaptchaV2Response = ref('');
    const recaptchaVerifyV2Response = ref('');

    const timeLeft = ref<string | null>();
    const selectedTime = ref(60);
    const intervalTimer = ref<ReturnType<typeof setInterval>>();

    onMounted(() => {
      loginMethod.value = props.loginPayload.loginMethod;
    });

    onBeforeUnmount(() => {
      if (intervalTimer.value) {
        clearInterval(intervalTimer.value);
      }
      verificationCode.value = '';
    });

    const backToForm = (): void => {
      setShowVerificationCodeField(false);
      setAuthErrorMessages(null);
    };

    // timer
    const displayTimeLeft = (secondsLeft: number): void => {
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = secondsLeft % 60;

      timeLeft.value = `${zeroPadded(minutes)}:${zeroPadded(seconds)}`;
    };

    const countdown = (end: number): void => {
      intervalTimer.value = setInterval(() => {
        const secondsLeft = Math.round((end - Date.now()) / 1000);

        if (secondsLeft < 0) {
          timeLeft.value = null;
          if (intervalTimer.value) {
            clearInterval(intervalTimer.value);
          }

          return;
        }
        displayTimeLeft(secondsLeft);
      }, 1000);
    };

    const timer = (seconds: number): void => {
      const now = Date.now();
      const end = now + seconds * 1000;
      displayTimeLeft(seconds);

      selectedTime.value = seconds;
      countdown(end);
    };

    const setTime = (seconds: number): void => {
      if (intervalTimer.value) {
        clearInterval(intervalTimer.value);
      }
      timer(seconds);
    };
    // end timer

    const onClickOutside = (): void => {
      showChangeMethod.value = false;
    };

    const loginByPassword = async (): Promise<void> => {
      if (isRecaptchaV2Shown.value && recaptchaV2Response.value) {
        doesRecaptchaV2HaveError.value = true;

        return;
      }

      setAuthLoading(true);
      try {
        await Vue.prototype.$recaptchaLoaded();
        const recaptchaResponse = await Vue.prototype.$recaptcha(RecaptchaActionType.LOGIN);
        loginByPasswordAction({
          ...props.loginPayload,
          loginMethod: loginMethod.value,
          recaptchaResponse,
          ...(isRecaptchaV2Shown.value && { recaptchaV2Response: recaptchaV2Response.value }),
        });
      } catch (err: any) {
        setAuthLoading(false);
        Vue.prototype.$toast.error(`${i18n.t('GENERAL.SERVICE_NOT_AVAILABLE')}`);
      }
    };

    const changeMethod = async (value: LoginMethod): Promise<void> => {
      loginMethod.value = value;
      await loginByPassword();
      onClickOutside();
    };

    const resendCode = async (): Promise<void> => {
      await loginByPassword();
      setTime(selectedTime.value);
      Vue.prototype.$toast.success(i18n.t('AUTH.CODE_RESEND_SUCCESSFULLY').toString());
    };

    const showMenu = (): void => {
      showChangeMethod.value = !showChangeMethod.value;
    };

    const onCodeComplete = (value: string): void => {
      verificationCode.value = value;
    };

    const verifyRecaptchaV2 = (response: string): void => {
      if (isRecaptchaV2Shown.value) {
        doesRecaptchaV2HaveError.value = false;
        recaptchaV2Response.value = response;
        // after a successful operation, we automatically repeat the login request

        loginByPassword().then();

        return;
      }

      doesRecaptchaVerifyV2HaveError.value = false;
      recaptchaVerifyV2Response.value = response;
    };

    const expiredRecaptchaV2 = (): void => {
      if (isRecaptchaV2Shown.value) {
        doesRecaptchaV2HaveError.value = true;
        recaptchaV2Response.value = '';

        return;
      }
      doesRecaptchaVerifyV2HaveError.value = false;
      recaptchaVerifyV2Response.value = '';
    };

    const verificationCodeRef = ref<InstanceType<typeof OtpFieldComponent>>();
    const loginVerify = async (): Promise<void> => {
      const isVerificationCodeValid = verificationCodeRef.value?.validate();
      if (!isVerificationCodeValid) {
        return;
      }

      if (isRecaptchaV2Shown.value && !recaptchaV2Response.value) {
        doesRecaptchaV2HaveError.value = true;

        return;
      }

      setLoginVerifyLoading(true);

      try {
        const recaptchaResponse = await Vue.prototype.$recaptcha(RecaptchaActionType.LOGIN_VERIFY);

        loginVerifyAction({
          ...props.loginPayload,
          loginMethod: authMethod.value,
          id: loginId.value as string,
          otpCode: verificationCode.value,
          trustDevice: trustDevice.value,
          recaptchaResponse,
          ...(isRecaptchaVerifyV2Shown.value && { recaptchaV2Response: recaptchaVerifyV2Response.value }),
        });
      } catch (error: any) {
        setLoginVerifyLoading(false);
        Vue.prototype.$toast.error(`${i18n.t('GENERAL.SERVICE_NOT_AVAILABLE')}`);
      }
    };

    const trustDeviceChange = (value: boolean): void => {
      trustDevice.value = value;
    };

    return {
      isRecaptchaVerifyV2Shown,
      authMethod,
      authMethods,
      recaptchaV2SiteKey,
      expiredRecaptchaV2,
      doesRecaptchaV2HaveError,
      isRecaptchaV2Shown,
      timeLeft,
      authLoading,
      verificationCodeRef,
      loginVerifyLoading,
      showChangeMethod,
      maskedVerificationMethod,

      loginVerify,
      onCodeComplete,
      verifyRecaptchaV2,
      resendCode,
      trustDeviceChange,
      onClickOutside,
      changeMethod,
      showMenu,
      backToForm,
    };
  },
});
