<template>
	<div class="password-field">
	  <payroll-text-field
	    v-model="password"
	    :placeholder="label"
	    :label="password? label : ''"
	    :hideDetails="false"
	    :error-messages="errorMessages"
	    :error="!validationPassed && !!password"
	    :type="showPassword ? 'text' : 'password'"
	    :append-icon="showPassword ? Icons.EYE_ICON : Icons.EYE_SLASH_ICON"
	    @click:append="showPassword = !showPassword"
	    @focus="focused"
	    @input="$emit('change',password) "
	    @blur="onBlur"
	  >
	  </payroll-text-field>
	  <div v-if="onTriggered" class="password-field__validation ps-5 py-4 pe-1">
	    <div class="password-field__validation-box">
	      <div v-for="(item, index) in validationResponse" :key="index" class="d-flex align-center py-1">
	        <payroll-icon v-if="item.valid" class="pe-4" name="fas fa-check-circle " size="14" color="success"> </payroll-icon>
	        <payroll-icon
	          v-else
	          class="pe-3"
	          :name="isFocused ? 'fas fa-circle' : 'fas fa-times-circle' "
	          :color="isFocused ? 'tertiary lighten-6' : 'error'"
	          size="14"
	        >
	        </payroll-icon>
	        <div class="password-field__validation-text">{{ item.text }}</div>
	      </div>
	    </div>
	  </div>
	</div>
</template>

<script lang="ts">
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
</script>

<style lang="scss">
.password-field {
  position: relative;

  &__validation {
    border-radius: 10px;
    box-shadow: 0 0 10px 0 rgba(186, 199, 220, 0.8);
    z-index: 1;
    background: var(--v-tertiary-base);
    left: 107%;
    bottom: 50%;
    transform: translateY(50%);
    position: absolute;
    width: 100%;

    &::after {
      content: '';
      background-color: var(--v-tertiary-base);
      position: absolute;
      width: 12px;
      height: 12px;
      bottom: calc(50% + 7px);
      left: 0;
      transform: translate(-50%, calc(100%)) rotate(135deg);
      box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2);
    }

    &-text {
      font-size: $font-xsm;
    }
  }
}
.v-application.v-application--is-rtl {
  .password-field {
    &__validation {
      left: -107%;

      &::after {
        right: -10px;
        transform: translate(-50%, calc(100%)) rotate(-45deg);
      }
    }
  }
}
</style>
