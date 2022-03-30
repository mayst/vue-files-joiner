import { LOGOUT } from '@views/auth/store/constants';
import { defineComponent, onMounted } from '@vue/composition-api';
import useAuthStore from '@views/auth/composables/use-auth-store';

export default defineComponent({
  setup() {
    const { useActions } = useAuthStore();

    const { [LOGOUT]: logout } = useActions([LOGOUT]);

    onMounted(logout);
  },
});
