<template>
	<div class="auth-page__wrapper">
	  <v-card class="auth__card d-flex auth-page__container" width="85%" min-height="85%">
	    <div class="auth-page__image-card">
	      <div class="d-flex justify-center flex-column justify-center">
	        <div class="d-flex justify-center">
	          <img
	            class="auth-page__image-logo"
	            :src="require(`@/assets/img/logo/hrm-logo-white-${$t('GENERAL.LANGUAGE')}.svg`)"
	            :alt="$t('GENERAL.HRM_LOGO')"
	          />
	        </div>
	        <div class="auth-page__title text-pre-line">{{ $t('AUTH.WELCOME_TO_HRM_SYSTEM') }}</div>
	      </div>
	      <div class="d-flex flex-column">
	        <img class="auth-page__image-family" src="@/assets/img/auth/auth-family.svg" :alt="$t('GENERAL.HRM_LOGO')" />
	        <div class="overflow-hidden">
	          <div class="auth-page__image-bottom"></div>
	        </div>
	      </div>
	    </div>
	    <div class="auth-page__form-card d-flex justify-center">
	      <payroll-language-switcher data-cy="language-switcher" class="hrm-absolute hrm-top-45 hrm-right-45" dropdown icon-name="fal fa-globe">
	      </payroll-language-switcher>
	      <router-view></router-view>
	    </div>
	  </v-card>
	  <user-companies-modal></user-companies-modal>
	  <forgot-password-modal></forgot-password-modal>
	  <login-failed-modal></login-failed-modal>
	  <totp-disabled-modal></totp-disabled-modal>
	</div>
</template>

<script lang="ts">
import UserCompaniesModal from '@/views/auth/modals/user-companies-modal/user-companies-modal.component.vue';
import ForgotPasswordModal from '@views/auth/modals/forgot-password-modal/forgot-password-modal.component.vue';
import LoginFailedModal from '@views/auth/modals/login-failed-modal/login-failed-modal.component.vue';
import TotpDisabledModal from '@views/auth/modals/totp-disabled-modal/totp-disabled-modal.component.vue';
import { GET_SERVER_VERSION } from '@/store/types';
import { defineComponent, onMounted } from '@vue/composition-api';
import { useActions } from 'vuex-composition-helpers';

export default defineComponent({
  components: { UserCompaniesModal, ForgotPasswordModal, LoginFailedModal, TotpDisabledModal },
  setup() {
    const { [GET_SERVER_VERSION]: getServerVersion } = useActions([GET_SERVER_VERSION]);

    onMounted(getServerVersion);
  },
});
</script>

