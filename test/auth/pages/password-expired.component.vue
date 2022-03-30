<template>
	<div class="password-expired my-auto">
	  <v-card class="password-expired__card mx-auto d-flex align-center justify-center flex-column pa-4">
	    <div v-if="!authSuccessOperation" class="d-flex flex-column justify-center align-center">
	      <img width="280px" src="@/assets/img/auth/password.svg" :alt="$t('GENERAL.PASSWORD')" />
	      <div class="auth__title text-center font-weight-light pt-4">{{ $t('AUTH.PASSWORD_HAS_EXPIRED') }}</div>

	      <div class="auth__text text-center mb-4">{{ $t('AUTH.PLEASE_CHANGE_TO_NEW_PSW') }}</div>
	      <payroll-error-alert class="password-expired__error" :errors="errorsMessages"></payroll-error-alert>
	      <div class="password-expired__field-container">
	        <ValidationObserver ref="observerRef">
	          <ValidationProvider name="AUTH.CURRENT_PASSWORD" :rules="{ required: true, max:16 }" v-slot="{ errors }">
	            <payroll-text-field
	              data-cy="current-password-field"
	              class="mt-2"
	              v-model="currentPassword"
	              autofocus
	              placeholder="AUTH.CURRENT_PASSWORD"
	              :label="currentPassword? 'AUTH.CURRENT_PASSWORD' : ''"
	              :type="showPassword ? 'text' : 'password'"
	              :append-icon="showPassword ? Icons.EYE_ICON : Icons.EYE_SLASH_ICON"
	              :hideDetails="false"
	              :error-messages="errors"
	              @click:append="showPassword = !showPassword"
	            >
	            </payroll-text-field>
	          </ValidationProvider>

	          <ValidationProvider name="AUTH.NEW_PASSWORD" :rules="{ required: true }" v-slot="{ errors }">
	            <password-field
	              data-cy="new-password-field"
	              class="mt-4"
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
	              data-cy="confirmed-new-password-field"
	              class="mt-4"
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
	        </ValidationObserver>
	      </div>

	      <v-card-actions>
	        <div class="d-flex justify-center flex-column align-center">
	          <payroll-button
	            data-cy="change-password-button"
	            class="my-2"
	            secondary
	            width="200"
	            text="AUTH.CHANGE_PASSWORD"
	            :disabled="loading"
	            :loading="loading"
	            @click="submit"
	          ></payroll-button>
	        </div>
	      </v-card-actions>
	    </div>
	    <div v-else class="password-expired__success d-flex flex-column justify-center align-center">
	      <img class="mt-4" width="200px" src="@/assets/img/success.svg" />

	      <div class="auth__title text-center font-weight-light pt-4">{{ $t('AUTH.PASSWORD_CHANGED_SUCCESSFULLY') }}</div>

	      <v-card-actions>
	        <payroll-button
	          data-cy="go-to-home-button"
	          class="py-8"
	          isText
	          color="secondary"
	          text="AUTH.CONTINUE_TO_HOME_PAGE"
	          :classArr="['underlined-text']"
	          @click="goToHome"
	        >
	        </payroll-button>
	      </v-card-actions>
	    </div>
	  </v-card>
	</div>
</template>

<script lang="ts">
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
</script>

<style lang="scss">
.password-expired {
  &__card {
    min-height: 630px;
    max-height: 95%;
    max-width: 70%;
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
