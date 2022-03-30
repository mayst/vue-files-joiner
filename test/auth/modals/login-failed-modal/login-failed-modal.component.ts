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
