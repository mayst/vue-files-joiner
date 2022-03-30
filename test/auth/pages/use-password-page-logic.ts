import { Ref, ref } from '@vue/composition-api';
import { ValidationObserver } from 'vee-validate';
import PasswordField from '@views/auth/components/password-field/password-field.component';
import useRouter from '@/shared/composables/use-router';

interface UsePasswordPageType {
  newPassword: Ref<string>;
  onChange: (value: string) => void;

  onError: (value: boolean) => void;
  checkError: () => boolean;

  observerRef: Ref<InstanceType<typeof ValidationObserver> | undefined>;
  passwordFieldRef: Ref<InstanceType<typeof PasswordField> | undefined>;

  goToHome: () => void;
}

export const usePasswordPageLogic = (): UsePasswordPageType => {
  const hasError = ref(true);
  const onError: UsePasswordPageType['onError'] = (value) => {
    hasError.value = value;
  };

  const newPassword = ref('');
  const onChange: UsePasswordPageType['onChange'] = (value) => {
    newPassword.value = value;
  };

  const observerRef: UsePasswordPageType['observerRef'] = ref();
  const passwordFieldRef: UsePasswordPageType['passwordFieldRef'] = ref();

  const checkError: UsePasswordPageType['checkError'] = () => {
    if (hasError.value) {
      passwordFieldRef.value?.validationTrigger();
    }

    return hasError.value;
  };

  const router = useRouter();
  const goToHome: UsePasswordPageType['goToHome'] = () => router.push({ name: 'home' });

  return {
    newPassword,
    onChange,
    onError,
    checkError,
    observerRef,
    passwordFieldRef,
    goToHome,
  };
};
