<template>
	<payroll-modal :open-event="openEvent" :close-event="closeEvent">
	  <template v-slot:toolbar-title>
	    <div class="d-flex flex-column justify-center align-center">
	      <div class="auth__modal-title text-pre-line text-center my-6 font-weight-regular">{{ $t('AUTH.TWO_FACTOR_IS_NOT_ENABLED') }}</div>
	    </div>
	  </template>

	  <template v-slot:content>
	    <div class="d-flex flex-column justify-center">
	      <div class="auth__text text-center text-pre-line">{{ $t('AUTH.TWO_FACTOR_SECURITY') }}</div>
	      <div class="auth__text text-center mt-6 mb-10 font-weight-bold">{{ $t('AUTH.YOU_CAN_ACTIVATE_TOTP') }}</div>
	    </div>
	  </template>

	  <template v-slot:actions="{ closeModal }">
	    <slot name="actions">
	      <div class="text-center flex-fill">
	        <payroll-button class="ms-4 mt-2" color="secondary" isText underlineText text="GENERAL.CLOSE" @click="closeModal"></payroll-button>
	      </div>
	    </slot>
	  </template>
	</payroll-modal>
</template>

<script lang="ts">
import { CLOSE_TOTP_DISABLED_MODAL, OPEN_TOTP_DISABLED_MODAL } from '@views/auth/constants';
import { defineComponent } from '@vue/composition-api';

const openEvent: string = OPEN_TOTP_DISABLED_MODAL;
const closeEvent: string = CLOSE_TOTP_DISABLED_MODAL;

export default defineComponent({
  setup() {
    return {
      openEvent,
      closeEvent,
    };
  },
});
</script>

