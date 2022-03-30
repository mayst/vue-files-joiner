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
