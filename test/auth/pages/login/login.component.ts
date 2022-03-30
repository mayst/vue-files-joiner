import Vue from 'vue';
import {
  AUTH_ERROR_MESSAGES,
  AUTH_LOADING,
  AUTH_METHOD,
  IS_RECAPTCHA_V2_SHOWN,
  LOGIN_BY_PASSWORD,
  LOGIN_ID,
  SET_AUTH_LOADING,
  SHOW_VERIFICATION_CODE_FIELD,
  TRUST_TOKEN,
} from '@views/auth/store/constants';
import { ValidationObserver, validate } from 'vee-validate';
import { Icons } from '@/shared/models/icons';
import { LoginMethod } from '@/views/auth/models/login-method.enum';
import { Login } from '@/views/auth/models/login';
import i18n from '@/plugins/i18n';
import VueRecaptcha from 'vue-recaptcha';
import PayrollTwoFactorAuthentication from '@views/auth/components/verification-code-field/verification-code-field.component.vue';
import { RecaptchaActionType } from '@views/auth/models/recaptcha-action-type.enum';
import eventBus from '@helpers/eventBus';
import { OPEN_RESET_PASSWORD_MODAL } from '@views/auth/constants';
import { computed, defineComponent, reactive, ref } from '@vue/composition-api';
import useAuthStore from '@views/auth/composables/use-auth-store';

const recaptchaV2SiteKey: string | undefined = process.env.VUE_APP_RECAPTCHA_V2_SITE_KEY;
const icons: typeof Icons = Icons;

export default defineComponent({
  components: {
    VueRecaptcha,
    PayrollTwoFactorAuthentication,
  },
  setup() {
    const { useActions, useMutations, useGetters } = useAuthStore();

    const { [LOGIN_BY_PASSWORD]: loginByPassword } = useActions([LOGIN_BY_PASSWORD]);

    const { [SET_AUTH_LOADING]: setAuthLoading } = useMutations([SET_AUTH_LOADING]);

    const {
      [AUTH_LOADING]: loading,
      [AUTH_ERROR_MESSAGES]: errorsMessages,
      [IS_RECAPTCHA_V2_SHOWN]: isRecaptchaV2Shown,
      [SHOW_VERIFICATION_CODE_FIELD]: showVerificationCodeField,
      [TRUST_TOKEN]: trustToken,
      [AUTH_METHOD]: authMethod,
      [LOGIN_ID]: loginId,
    } = useGetters([AUTH_LOADING, AUTH_ERROR_MESSAGES, IS_RECAPTCHA_V2_SHOWN, SHOW_VERIFICATION_CODE_FIELD, TRUST_TOKEN, AUTH_METHOD, LOGIN_ID]);

    const showPassword = ref(false);
    const recaptchaV2Response = ref('');
    const doesRecaptchaV2HaveError = ref(false);

    const loginData = reactive<Login>({
      loginMethod: LoginMethod.SMS,
      idNumber: null,
      isMobile: false,
      password: '',
    });

    const trustUserToken = computed(() => trustToken.value(loginData.idNumber as number));

    const onSearchInput = (value: string, prop: string): void => {
      loginData[prop] = value;
    };

    const verifyRecaptchaV2 = (response: string): void => {
      recaptchaV2Response.value = response;
      doesRecaptchaV2HaveError.value = false;
    };

    const expiredRecaptchaV2 = (): void => {
      recaptchaV2Response.value = '';
      doesRecaptchaV2HaveError.value = true;
    };

    const observerRef = ref<InstanceType<typeof ValidationObserver>>();
    const login = async (): Promise<void> => {
      const isValid = await observerRef.value?.validate();
      if (!isValid) {
        return;
      }

      if (isRecaptchaV2Shown.value && !recaptchaV2Response.value) {
        doesRecaptchaV2HaveError.value = true;

        return;
      }

      setAuthLoading(true);
      try {
        await Vue.prototype.$recaptchaLoaded();
        const recaptchaResponse = await Vue.prototype.$recaptcha(RecaptchaActionType.LOGIN);
        loginByPassword({
          ...loginData,
          id: loginId.value,
          trustToken: trustUserToken.value || undefined,
          loginMethod: authMethod.value,
          appVersion: process.env.VUE_APP_VERSION_NUMBER,
          recaptchaResponse,
          ...(isRecaptchaV2Shown.value && { recaptchaV2Response: recaptchaV2Response.value }),
        });
      } catch (error: any) {
        setAuthLoading(false);
        Vue.prototype.$toast.error(`${i18n.t('GENERAL.SERVICE_NOT_AVAILABLE')}`);
      }
    };

    const forgotPassword = async (): Promise<void> => {
      const { valid } = await validate(loginData.idNumber, { numeric: true, max: 9, min: 7, id_number: true });
      eventBus.$emit(OPEN_RESET_PASSWORD_MODAL, valid ? loginData.idNumber : null);
    };

    return {
      loginData,
      doesRecaptchaV2HaveError,
      recaptchaV2SiteKey,
      expiredRecaptchaV2,
      verifyRecaptchaV2,
      isRecaptchaV2Shown,
      showVerificationCodeField,
      showPassword,
      loading,
      errorsMessages,
      icons,
      observerRef,

      forgotPassword,
      login,
      onSearchInput,
    };
  },
});
