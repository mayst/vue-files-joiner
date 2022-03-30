import { createNamespacedHelpers } from 'vuex-composition-helpers';
import AuthGetters from '@views/auth/store/types/getters';
import { StoreNamespace } from '@/store/store-namespace';
import AuthState from '@views/auth/store/types/state';
import AuthMutations from '@views/auth/store/types/mutations';
import AuthActions from '@views/auth/store/types/actions';

const useAuthStore = () => createNamespacedHelpers<AuthState, AuthGetters, AuthActions, AuthMutations>(StoreNamespace.AUTH_MODULE);

export default useAuthStore;
