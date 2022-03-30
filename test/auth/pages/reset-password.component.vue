<template>
	<div class="reset-password my-auto">
	  <v-card class="reset-password__card mx-auto d-flex align-center flex-column" max-width="70%">
	    <div v-if="!authSuccessOperation" class="d-flex flex-column justify-center align-center">
	      <img class="mt-8" width="280px" src="@/assets/img/auth/password.svg" :alt="$t('GENERAL.PASSWORD')" />
	      <div class="auth__title text-center font-weight-light pt-4">{{ $t('AUTH.RESET_PASSWORD') }}</div>
	      <div class="auth__text text-center mb-4">{{ $t('AUTH.PLEASE_ENTER_FIELDS') }}</div>
	      <payroll-error-alert class="reset-password__error" :errors="errorsMessages"></payroll-error-alert>

	      <div class="reset-password__field-container">
	        <ValidationObserver ref="observerRef">
	          <div>
	            <ValidationProvider name="AUTH.ID_NUMBER" :rules="{required: true,numeric: true, max: 9, min: 7 }" v-slot="{ errors }">
	              <payroll-text-field
	                data-cy="id-number-field"
	                class="mt-2"
	                v-model="idNumber"
	                autofocus
	                placeholder="AUTH.ID_NUMBER"
	                :label="idNumber? 'AUTH.ID_NUMBER' : ''"
	                :hideDetails="false"
	                :error-messages="errors"
	              >
	              </payroll-text-field>
	            </ValidationProvider>

	            <ValidationProvider name="AUTH.NEW_PASSWORD" :rules="{ required: true }" v-slot="{ errors }">
	              <password-field
	                data-cy="new-password-field"
	                class="mt-5"
	                ref="passwordFieldRef"
	                v-model="newPassword"
	                label="AUTH.NEW_PASSWORD"
	                :error-messages="errors"
	                @change="onChange($event)"
	                @onError="onError($event)"
	              ></password-field>
	            </ValidationProvider>

	            <ValidationProvider name="AUTH.VERIFY_NEW_PASSWORD" :rules="{ required: true, passwords_mismatch: [newPassword] }" v-slot="{ errors }">
	              <payroll-text-field
	                data-cy="new-password-confirmation-field"
	                class="mt-5"
	                v-model="confirmedPassword"
	                placeholder="AUTH.VERIFY_NEW_PASSWORD"
	                type="password"
	                :label="confirmedPassword? 'AUTH.VERIFY_NEW_PASSWORD' : ''"
	                :hideDetails="false"
	                :error-messages="errors"
	                @keyup.native.enter="submit"
	              >
	              </payroll-text-field>
	            </ValidationProvider>
	          </div>
	        </ValidationObserver>
	      </div>

	      <v-card-actions>
	        <div class="d-flex justify-center flex-column align-center mb-2">
	          <payroll-recaptcha-v2
	            v-if="isRecaptchaV2Shown"
	            class="mb-1"
	            :hasError="hasRecaptchaV2Error"
	            @verifyRecaptchaV2="verifyRecaptchaV2($event)"
	            @expiredRecaptchaV2="expiredRecaptchaV2()"
	          ></payroll-recaptcha-v2>
	          <payroll-button
	            data-cy="reset-password-button"
	            class="mb-6 mt-2"
	            secondary
	            width="200"
	            text="AUTH.RESET_PASSWORD"
	            :disabled="loading"
	            :loading="loading"
	            @click="submit"
	          ></payroll-button>
	        </div>
	      </v-card-actions>
	    </div>
	    <div v-else class="reset-password__success d-flex flex-column justify-center align-center">
	      <img class="mt-4" width="200px" src="@/assets/img/success.svg" />

	      <div class="auth__title text-center font-weight-light pt-4">{{ $t('AUTH.YOU_HAVE_NEW_PASSWORD') }}</div>

	      <v-card-actions>
	        <payroll-button class="py-8" isText color="secondary" text="AUTH.CONTINUE_TO_HOME_PAGE" :classArr="['underlined-text']" @click="goToHome">
	        </payroll-button>
	      </v-card-actions>
	    </div>
	  </v-card>
	</div>
</template>

<script lang="ts">
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
</script>

<style lang="scss">
.reset-password {
  &__card {
    min-height: 630px;
  }

  &__field-container {
    min-width: 330px;
  }

  &__success {
    margin: 130px 0;
  }

  &__error {
    min-width: 450px;
  }
}
</style>
