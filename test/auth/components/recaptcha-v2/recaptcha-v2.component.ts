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
