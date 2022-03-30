import { Icons } from '@/shared/models/icons';
import { defineComponent, ref, watch, PropType, onMounted } from '@vue/composition-api';
import { usePasswordValidation } from './usePasswordValidation';

export default defineComponent({
  props: {
    label: String,
    placeholder: String,
    errorMessages: [Array, String] as PropType<Array<string> | string>,
    value: { type: String, default: '' },
  },
  setup(props, { emit }) {
    const password = ref('');
    const showPassword = ref(false);
    const isFocused = ref(false);
    const onTriggered = ref(false);

    const { validationResponse, validationPassed } = usePasswordValidation(password);

    onMounted(() => {
      onTriggered.value = false;
      password.value = props.value;
    });

    const focused = (): void => {
      isFocused.value = true;
      onTriggered.value = true;
    };

    const onBlur = (): void => {
      isFocused.value = false;
      onTriggered.value = false;
    };

    const validationTrigger = (): void => {
      onTriggered.value = false;
    };

    watch(validationPassed, (newValue) => {
      emit('onError', !newValue);
    });

    watch(
      () => props.value,
      (newValue) => {
        password.value = newValue;
      }
    );

    return {
      isFocused,
      password,
      showPassword,
      Icons,
      validationPassed,
      validationResponse,
      validationTrigger,
      focused,
      onBlur,
      onTriggered,
    };
  },
});
