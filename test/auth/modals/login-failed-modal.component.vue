<template>
	<payroll-modal :open-event="openEvent" :close-event="closeEvent">
	  <template v-slot:toolbar-title>
	    <div class="login-failed d-flex flex-column justify-center align-center">
	      <img class="mt-4" width="250px" src="@/assets/img/auth/password.svg" />
	      <div class="login-failed__title text-center my-6 text-pre-line">{{ $t('AUTH.DEAR_EMPLOYEE_LOGIN_FAILED') }}</div>
	    </div>
	  </template>

	  <template v-slot:content>
	    <div class="d-flex flex-column justify-center">
	      <div class="auth__text text-center mb-8 text-pre-line">{{ $t('AUTH.YOU_CAN_PERFORM_RESET_PASSWORD') }}</div>
	    </div>
	  </template>

	  <template v-slot:actions="{ closeModal }">
	    <slot name="actions">
	      <div class="login-failed__actions d-flex flex-column justify-center align-center">
	        <payroll-button class="login-btn my-5" secondary width="200" text="AUTH.RESET_PASSWORD" @click="openForgotPasswordModal"></payroll-button>
	      </div>
	    </slot>
	  </template>
	</payroll-modal>
</template>

<script lang="ts">
import eventBus from '@helpers/eventBus';
import { OPEN_LOGIN_FAILED_MODAL, CLOSE_LOGIN_FAILED_MODAL, OPEN_RESET_PASSWORD_MODAL } from '@views/auth/constants';
import { defineComponent } from '@vue/composition-api';

const openEvent: string = OPEN_LOGIN_FAILED_MODAL;
const closeEvent: string = CLOSE_LOGIN_FAILED_MODAL;

export default defineComponent({
  setup() {
    const openForgotPasswordModal = (): void => {
      eventBus.$emit(CLOSE_LOGIN_FAILED_MODAL);
      eventBus.$emit(OPEN_RESET_PASSWORD_MODAL);
    };

    return {
      openEvent,
      closeEvent,
      openForgotPasswordModal,
    };
  },
});
</script>

<style lang="scss">
.login-failed {
  &__title {
    font-weight: 700;
    font-size: $font-xxlg;
  }

  &__actions {
    width: 100%;
  }
}
</style>
