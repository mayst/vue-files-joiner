import { Icons } from '@/shared/models/icons';
import PasswordField from '@views/auth/components/password-field/password-field.component.vue';
import {
  AUTH_ERROR_MESSAGES,
  AUTH_LOADING,
  AUTH_SUCCESS_OPERATION,
  SET_AUTH_SUCCESS_OPERATION,
  CHANGE_EXPIRED_PASSWORD,
  SET_AUTH_LOADING,
} from '@views/auth/store/constants';
import passwordMismatchValidator from '@/views/auth/validators/password-mismatch-validator';
import { defineComponent, ref, onBeforeUnmount, watch } from '@vue/composition-api';
import { usePasswordPageLogic } from '@views/auth/pages/use-password-page-logic';
import useAuthStore from '@views/auth/composables/use-auth-store';

passwordMismatchValidator();

export default defineComponent({
  components: {
    PasswordField,
  },
  setup() {
    const { useActions, useMutations, useGetters } = useAuthStore();

    const { [CHANGE_EXPIRED_PASSWORD]: changeExpiredPassword } = useActions([CHANGE_EXPIRED_PASSWORD]);

    const { [SET_AUTH_SUCCESS_OPERATION]: setAuthSuccessOperation, [SET_AUTH_LOADING]: setAuthLoading } = useMutations([
      SET_AUTH_SUCCESS_OPERATION,
      SET_AUTH_LOADING,
    ]);

    const {
      [AUTH_LOADING]: loading,
      [AUTH_ERROR_MESSAGES]: errorsMessages,
      [AUTH_SUCCESS_OPERATION]: authSuccessOperation,
    } = useGetters([AUTH_LOADING, AUTH_ERROR_MESSAGES, AUTH_SUCCESS_OPERATION]);

    const currentPassword = ref('');
    const confirmedPassword = ref('');
    const showPassword = ref(false);

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

    onBeforeUnmount(() => {
      setAuthSuccessOperation(false);
    });

    const submit = async (): Promise<void> => {
      const isValid = await observerRef.value?.validate();
      if (!isValid || checkError()) {
        return;
      }

      changeExpiredPassword({
        password: currentPassword.value,
        newPassword: newPassword.value,
      });
    };

    return {
      loading,
      setAuthLoading,

      observerRef,
      passwordFieldRef,

      errorsMessages,
      newPassword,
      currentPassword,
      confirmedPassword,
      authSuccessOperation,
      Icons,

      onChange,
      onError,
      submit,
      goToHome,
      showPassword,
    };
  },
});
