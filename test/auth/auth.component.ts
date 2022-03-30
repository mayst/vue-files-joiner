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
