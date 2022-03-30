<template>
	<payroll-modal
	  :open-event="openEvent"
	  :modal-close-callback="closeDialogCallback"
	  :close-event="closeEvent"
	  :modal-open-callback="modalOpenCallback.bind(this)"
	  @close="closeDialogCallback"
	>
	  <template v-slot:toolbar-title>
	    <div class="forgot-password d-flex flex-column justify-center align-center">
	      <img class="my-4" width="280px" src="@/assets/img/auth/password.svg" />
	      <div class="auth__title font-weight-light my-6">{{ $t('AUTH.RESET_PASSWORD') }}</div>
	    </div>
	  </template>

	  <template v-slot:content>
	    <payroll-error-alert :errors="errors"></payroll-error-alert>
	    <div v-if="!authSuccessOperation" class="forgot-password__fields d-flex align-center flex-column justify-center">
	      <div class="auth__text text-center mb-4">{{ $t('AUTH.PLEASE_ENTER_YOUR_ID_NUMBER') }}</div>
	      <ValidationObserver ref="observerRef">
	        <ValidationProvider name="AUTH.ID_NUMBER" :rules="{ required: true, numeric: true, max: 9, min: 7}" v-slot="{ errors }">
	          <payroll-text-field
	            data-cy="forgot-password-field"
	            class="forgot-password__field"
	            v-model="idNumber"
	            autofocus
	            placeholder="AUTH.ID_NUMBER"
	            :label="idNumber? 'AUTH.ID_NUMBER' : ''"
	            :hideDetails="false"
	            :error-messages="errors"
	            @keyup.native.enter="send"
	          >
	          </payroll-text-field>
	        </ValidationProvider>
	      </ValidationObserver>

	      <payroll-recaptcha-v2
	        v-if="isRecaptchaV2Shown"
	        class="mb-1"
	        :hasError="hasRecaptchaV2Error"
	        @verifyRecaptchaV2="verifyRecaptchaV2($event)"
	        @expiredRecaptchaV2="expiredRecaptchaV2()"
	      >
	      </payroll-recaptcha-v2>
	    </div>
	    <div v-else class="d-flex flex-column justify-center">
	      <div class="auth__text text-center mb-8 text-pre-line">{{ $t('AUTH.EXPLANATION_HAS_BEEN_SENT') }}</div>
	    </div>
	  </template>

	  <template v-slot:actions="{ closeModal }">
	    <slot name="actions">
	      <div class="forgot-password__actions d-flex flex-column justify-center align-center mb-4">
	        <payroll-button
	          v-if="!authSuccessOperation"
	          data-cy="send-forgot-password-mail-button"
	          class="login-btn my-5"
	          secondary
	          width="200"
	          text="GENERAL.SEND"
	          :disabled="loading"
	          :loading="loading"
	          @click="send"
	        ></payroll-button>
	        <payroll-button
	          v-else
	          data-cy="close-forgot-password-modal-button"
	          class="py-8"
	          isText
	          color="secondary"
	          text="GENERAL.CLOSE"
	          :classArr="['underlined-text']"
	          @click="close"
	        >
	        </payroll-button>
	      </div>
	    </slot>
	  </template>
	</payroll-modal>
</template>

<script lang="ts">
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
</script>

<style lang="scss">
.forgot-password {
  &__actions {
    width: 100%;
  }

  &__fields {
    min-width: 32px;
  }
  &__field {
    min-width: 280px;
  }
}
</style>
