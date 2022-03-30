<template>
	<div class="recaptcha">
	  <vue-recaptcha :sitekey="siteKey" @verify="verify" @expired="expired"></vue-recaptcha>
	  <div class="auth__recaptcha--error py-1" v-if="hasError">{{ $t('AUTH.VERIFY_YOU_ARE_NOT_A_ROBOT') }}</div>
	</div>
</template>

<script lang="ts">
import VueRecaptcha from 'vue-recaptcha';
import { defineComponent } from '@vue/composition-api';

const siteKey: string | undefined = process.env.VUE_APP_RECAPTCHA_V2_SITE_KEY;

export default defineComponent({
  components: {
    VueRecaptcha,
  },
  props: {
    hasError: Boolean,
  },
  setup(props, { emit }) {
    const verify = (response: string): void => {
      emit('verifyRecaptchaV2', response);
    };

    const expired = (): void => {
      emit('expiredRecaptchaV2');
    };

    return {
      verify,
      expired,
      siteKey,
    };
  },
});
</script>

<style lang="scss">
</style>
