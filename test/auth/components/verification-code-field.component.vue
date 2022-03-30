<template>
	<div class="verification">
	  <payroll-button
	    class="hrm-absolute hrm-top-40 hrm-left-40"
	    primary
	    plain
	    icon-name="far fa-chevron-left"
	    text="AUTH.BACK_TO_PREVIOUS"
	    :class-arr="['arrow-icon']"
	    @click="backToForm"
	  ></payroll-button>

	  <div class="d-flex flex-column justify-center align-center">
	    <div class="auth__text text-center" v-if="authMethod">
	      {{ $t('AUTH.CODE_SENT', { device:  $t(`AUTH.${authMethods[authMethod]}_METHOD`).toLowerCase() }) }}
	    </div>
	    <div v-if="maskedVerificationMethod" class="auth__text my-2">{{ maskedVerificationMethod }}</div>
	    <div class="auth__text font-weight-bold my-3">{{ $t('AUTH.ENTER_CODE') }}</div>

	    <div class="mt-1 mb-3 hrm-height-100 d-flex flex-column align-center justify-space-between">
	      <payroll-otp-field
	        ref="verificationCodeRef"
	        :length="authMethod === authMethods.TOTP ? 6 : 7"
	        :key="authMethod"
	        @onComplete="onCodeComplete($event)"
	        @keyup.native.enter="loginVerify"
	      >
	      </payroll-otp-field>

	      <!--      <div class="mb-6 hrm-font-size-14">{{$t('AUTH.CODE_EXPIRES_IN',{timer: '10:25'})}}</div>-->
	    </div>

	    <div v-if="isRecaptchaVerifyV2Shown" class="pt-3">
	      <vue-recaptcha :sitekey="recaptchaV2SiteKey" @verify="verifyRecaptchaV2" @expired="expiredRecaptchaV2"></vue-recaptcha>

	      <div v-if="doesRecaptchaV2HaveError" class="auth__recaptcha--error py-1">{{ $t('AUTH.VERIFY_YOU_ARE_NOT_A_ROBOT') }}</div>
	    </div>

	    <div class="verification__login-recaptcha">
	      <div v-if="isRecaptchaV2Shown" class="verification__login-recaptcha-card p-4">
	        <vue-recaptcha :sitekey="recaptchaV2SiteKey" @verify="verifyRecaptchaV2" @expired="expiredRecaptchaV2"></vue-recaptcha>

	        <div v-if="doesRecaptchaV2HaveError" class="auth__recaptcha--error py-1">{{ $t('AUTH.VERIFY_YOU_ARE_NOT_A_ROBOT') }}</div>
	      </div>
	    </div>

	    <div class="d-flex flex-row justify-center">
	      <payroll-checkbox
	        data-cy="trust-device-checkbox"
	        class="verification__checkbox"
	        horizontal
	        label="AUTH.TRUST_THIS_COMPUTER"
	        @input="trustDeviceChange"
	      >
	      </payroll-checkbox>
	      <payroll-tooltip maxWidth="200" tooltipText="AUTH.TRUST_THIS_COMPUTER_TOOLTIP" :tooltipTextSize="14" :iconSize="16"></payroll-tooltip>
	    </div>

	    <payroll-button
	      data-cy="sign-in-by-otp-button"
	      class="mt-1 mb-6"
	      secondary
	      width="250"
	      text="AUTH.ENTER"
	      :disabled="loginVerifyLoading"
	      :loading="loginVerifyLoading"
	      @click="loginVerify"
	    ></payroll-button>

	    <div class="hrm-height-80 d-flex flex-column justify-end">
	      <payroll-button
	        v-if="!timeLeft"
	        class="mb-1"
	        is-text
	        color="secondary"
	        text="AUTH.RESEND_CODE_AGAIN"
	        :class-arr="['underlined-text']"
	        :loading="authLoading"
	        :disabled="authLoading"
	        @click="resendCode"
	      >
	      </payroll-button>

	      <div v-else class="mb-1">{{ timeLeft }}</div>
	    </div>

	    <div class="verification__change-auth d-flex justify-center" v-click-outside="onClickOutside">
	      <div class="change-auth-method" v-if="showChangeMethod">
	        <div class="change-auth-method__content d-flex flex-row">
	          <div v-if="authMethod !== authMethods.EMAIL" class="d-flex flex-column my-5 mt-5">
	            <payroll-button
	              class="change-auth-method__btn mx-8 my-2"
	              width="120"
	              text="AUTH.EMAIL"
	              icon-size="30"
	              icon-color="secondary"
	              prepend-icon-name="fab fa-telegram"
	              :loading="authLoading"
	              :disabled="authLoading"
	              :text-color="'var(--v-secondary-base)'"
	              @click="changeMethod(authMethods.EMAIL)"
	            >
	            </payroll-button>
	            <div class="change-auth-method__text mx-7">{{ $t('AUTH.GET_CODE_BY_EMAIL') }}</div>
	          </div>

	          <div v-if="authMethod !== authMethods.TOTP" class="d-flex flex-column my-5 mt-5">
	            <payroll-button
	              class="change-auth-method__btn mx-8 my-2"
	              width="120"
	              text="AUTH.TOTP"
	              :loading="authLoading"
	              :disabled="authLoading"
	              :text-color="'var(--v-secondary-base)'"
	              :append-img="require('@/assets/img/auth/google.svg')"
	              @click="changeMethod(authMethods.TOTP)"
	            ></payroll-button>
	            <div class="change-auth-method__text mx-7">{{ $t('AUTH.GET_CODE_BY_APP') }}</div>
	          </div>

	          <div v-if="authMethod !== authMethods.SMS" class="d-flex flex-column my-5 mt-5">
	            <payroll-button
	              class="change-auth-method__btn mx-8 my-2"
	              width="120"
	              text="AUTH.SMS"
	              icon-size="30"
	              icon-color="secondary"
	              :loading="authLoading"
	              :disabled="authLoading"
	              :text-color="'var(--v-secondary-base)'"
	              :append-img="require('@/assets/img/auth/sms.svg')"
	              @click="changeMethod(authMethods.SMS)"
	            ></payroll-button>
	            <div class="change-auth-method__text mx-7">{{ $t('AUTH.GET_CODE_BY_SMS') }}</div>
	          </div>
	        </div>
	      </div>
	      <payroll-button
	        class="mb-5"
	        is-text
	        color="secondary"
	        text="AUTH.CHANGE_AUTHENTICATION_METHOD"
	        :classArr="['underlined-text']"
	        @click="showMenu"
	      >
	      </payroll-button>
	    </div>
	  </div>
	</div>
</template>

<script lang="ts">
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
</script>

