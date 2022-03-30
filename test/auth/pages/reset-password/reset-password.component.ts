import Vue from 'vue';
import {
  AUTH_ERROR_MESSAGES,
  AUTH_LOADING,
  IS_RECAPTCHA_V2_SHOWN,
  AUTH_SUCCESS_OPERATION,
  SET_AUTH_SUCCESS_OPERATION,
  SET_AUTH_LOADING,
  RESET_PASSWORD,
  VALIDATE_RESET_PASSWORD_TOKEN,
} from '@views/auth/store/constants';
import passwordMismatchValidator from '@/views/auth/validators/password-mismatch-validator';
import i18n from '@/plugins/i18n';
import { RecaptchaActionType } from '@views/auth/models/recaptcha-action-type.enum';
import { ResetPasswordReq } from '@views/auth/models/reset-password-req';
import { LoginMethod } from '@views/auth/models/login-method.enum';
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from '@vue/composition-api';
import { Icons } from '@/shared/models/icons';
import useRoute from '@/shared/composables/use-route';
import { usePasswordPageLogic } from '@views/auth/pages/use-password-page-logic';
import useAuthStore from '@views/auth/composables/use-auth-store';
import PasswordField from '@views/auth/components/password-field/password-field.component.vue';

passwordMismatchValidator();

const loginMethod: typeof LoginMethod = LoginMethod;

export default defineComponent({
  components: {
    PasswordField,
  },
  setup() {
    const { useActions, useMutations, useGetters } = useAuthStore();

    const { [RESET_PASSWORD]: resetPassword, [VALIDATE_RESET_PASSWORD_TOKEN]: validateResetPasswordToken } = useActions([
      RESET_PASSWORD,
      VALIDATE_RESET_PASSWORD_TOKEN,
    ]);

    const { [SET_AUTH_SUCCESS_OPERATION]: setAuthSuccessOperation, [SET_AUTH_LOADING]: setAuthLoading } = useMutations([
      SET_AUTH_SUCCESS_OPERATION,
      SET_AUTH_LOADING,
    ]);

    const {
      [IS_RECAPTCHA_V2_SHOWN]: isRecaptchaV2Shown,
      [AUTH_LOADING]: loading,
      [AUTH_ERROR_MESSAGES]: errorsMessages,
      [AUTH_SUCCESS_OPERATION]: authSuccessOperation,
    } = useGetters([IS_RECAPTCHA_V2_SHOWN, AUTH_LOADING, AUTH_ERROR_MESSAGES, AUTH_SUCCESS_OPERATION]);

    const idNumber = ref(null);
    const confirmedPassword = ref('');
    const recaptchaV2Response = ref('');
    const hasRecaptchaV2Error = ref(false);

    const route = useRoute();
    const validateToken = async (): Promise<void> => {
      await Vue.prototype.$recaptchaLoaded();
      const recaptchaResponse = await Vue.prototype.$recaptcha(RecaptchaActionType.VALIDATE_RESET_PASSWORD);
      await validateResetPasswordToken({
        recaptchaResponse,
        resetPwToken: String(route.query.t),
      });
    };

    onMounted(validateToken);
    onBeforeUnmount(() => {
      setAuthSuccessOperation(false);
    });

    const verifyRecaptchaV2 = (response: string): void => {
      recaptchaV2Response.value = response;
      hasRecaptchaV2Error.value = false;
    };

    const expiredRecaptchaV2 = (): void => {
      recaptchaV2Response.value = '';
      hasRecaptchaV2Error.value = true;
    };

    const {
      newPassword,
      onChange,

      onError,
      checkError,

      observerRef,
      passwordFieldRef,

      goToHome,
    } = usePasswordPageLogic();

    watch(authSuccessOperation, (newValue) => {
      if (newValue) {
        setTimeout(() => goToHome(), 5000);
      }
    });

    const submit = async (): Promise<void> => {
      const isValid = await observerRef.value?.validate();

      if (!isValid || checkError()) {
        return;
      }

      if (isRecaptchaV2Shown.value && !recaptchaV2Response.value) {
        hasRecaptchaV2Error.value = true;
      }

      const payload: ResetPasswordReq = {
        resetPwToken: String(route.query.t),
        idNumber: idNumber.value,
        isMobile: false,
        loginMethod: loginMethod.RESET,
        password: newPassword.value,
      };
      setAuthLoading(true);

      try {
        await Vue.prototype.$recaptchaLoaded();
        const recaptchaResponse = await Vue.prototype.$recaptcha(RecaptchaActionType.RESET_PASSWORD);
        resetPassword({
          ...payload,
          recaptchaResponse,
          ...(isRecaptchaV2Shown.value && { recaptchaV2Response: recaptchaV2Response.value }),
        });
      } catch (error: any) {
        setAuthLoading(false);
        Vue.prototype.$toast.error(`${i18n.t('GENERAL.SERVICE_NOT_AVAILABLE')}`);
      }
    };

    return {
      idNumber,
      loading,
      authSuccessOperation,

      errorsMessages,
      onError,

      newPassword,
      confirmedPassword,
      passwordFieldRef,
      observerRef,

      Icons,
      isRecaptchaV2Shown,
      hasRecaptchaV2Error,
      verifyRecaptchaV2,
      expiredRecaptchaV2,

      onChange,
      submit,
      goToHome,
      setAuthLoading,
    };
  },
});
