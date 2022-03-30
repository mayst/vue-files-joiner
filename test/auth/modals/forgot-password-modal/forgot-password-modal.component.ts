import Vue from 'vue';
import eventBus from '@helpers/eventBus';
import {
  AUTH_FORM_LOADING,
  AUTH_SUCCESS_OPERATION,
  IS_RECAPTCHA_V2_SHOWN,
  SEND_FORGOT_PASSWORD_MAIL,
  AUTH_FORM_ERRORS,
  SET_AUTH_FORM_LOADING,
  SET_AUTH_SUCCESS_OPERATION,
} from '@views/auth/store/constants';
import { OPEN_RESET_PASSWORD_MODAL, CLOSE_RESET_PASSWORD_MODAL } from '@views/auth/constants';
import { ValidationObserver } from 'vee-validate';
import { RecaptchaActionType } from '@views/auth/models/recaptcha-action-type.enum';
import i18n from '@/plugins/i18n';
import VueRecaptcha from 'vue-recaptcha';
import { defineComponent, Ref, ref } from '@vue/composition-api';
import useAuthStore from '@views/auth/composables/use-auth-store';

const openEvent: string = OPEN_RESET_PASSWORD_MODAL;
const closeEvent: string = CLOSE_RESET_PASSWORD_MODAL;

type validationObserverType = InstanceType<typeof ValidationObserver>;

export default defineComponent({
  components: {
    VueRecaptcha,
  },
  props: {
    hasError: Boolean,
  },
  setup(props, ctx) {
    const { useActions, useMutations, useGetters } = useAuthStore();

    const { [SEND_FORGOT_PASSWORD_MAIL]: sendForgotPasswordMail } = useActions([SEND_FORGOT_PASSWORD_MAIL]);

    const { [SET_AUTH_SUCCESS_OPERATION]: setAuthSuccessOperation, [SET_AUTH_FORM_LOADING]: setAuthFormLoading } = useMutations([
      SET_AUTH_SUCCESS_OPERATION,
      SET_AUTH_FORM_LOADING,
    ]);

    const {
      [AUTH_FORM_LOADING]: loading,
      [AUTH_FORM_ERRORS]: errors,
      [AUTH_SUCCESS_OPERATION]: authSuccessOperation,
      [IS_RECAPTCHA_V2_SHOWN]: isRecaptchaV2Shown,
    } = useGetters([AUTH_FORM_LOADING, AUTH_FORM_ERRORS, AUTH_SUCCESS_OPERATION, IS_RECAPTCHA_V2_SHOWN]);

    const idNumber: Ref<number | null> = ref(null);
    const recaptchaV2Response = ref('');
    const hasRecaptchaV2Error = ref(false);

    const verifyRecaptchaV2 = (response: string): void => {
      recaptchaV2Response.value = response;
      hasRecaptchaV2Error.value = false;
    };

    const expiredRecaptchaV2 = (): void => {
      recaptchaV2Response.value = '';
      hasRecaptchaV2Error.value = true;
    };

    // Todo: resolve ctx.refs when migrate to Vue 3
    // We can not use simple ref in this case because our ValidationObserve component is located in slot
    const getObserverRef = (): validationObserverType => ctx.refs.observerRef as validationObserverType;

    const send = async (): Promise<void> => {
      const isValid = await getObserverRef()?.validate();
      if (!isValid) {
        return;
      }

      if (isRecaptchaV2Shown.value && !recaptchaV2Response.value) {
        hasRecaptchaV2Error.value = true;

        return;
      }

      setAuthFormLoading(true);
      try {
        await Vue.prototype.$recaptchaLoaded();
        const recaptchaResponse = await Vue.prototype.$recaptcha(RecaptchaActionType.SEND_FORGOT_PASSWORD);
        sendForgotPasswordMail({
          idNumber: idNumber.value,
          recaptchaResponse,
          ...(isRecaptchaV2Shown.value && { recaptchaV2Response: recaptchaV2Response.value }),
        });
      } catch (error: any) {
        setAuthFormLoading(false);
        Vue.prototype.$toast.error(`${i18n.t('GENERAL.SERVICE_NOT_AVAILABLE')}`);
      }
    };

    const close = (): void => {
      eventBus.$emit(CLOSE_RESET_PASSWORD_MODAL);
    };

    const closeDialogCallback = (): void => {
      setAuthSuccessOperation(false);
      idNumber.value = null;
      getObserverRef()?.reset();
    };

    const modalOpenCallback = (idNumberParam: number): void => {
      if (idNumberParam) {
        idNumber.value = idNumberParam;
      }
    };

    return {
      loading,
      errors,
      authSuccessOperation,
      openEvent,
      closeEvent,
      isRecaptchaV2Shown,
      hasRecaptchaV2Error,
      idNumber,

      verifyRecaptchaV2,
      expiredRecaptchaV2,
      close,
      closeDialogCallback,
      modalOpenCallback,
      send,
    };
  },
});
