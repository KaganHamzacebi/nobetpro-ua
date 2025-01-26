import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./(app|components|libs)/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        /** Accent Colours */
        ok: '#78D428',
        'ok-50': '#F2FBEA',
        'ok-200': '#CAEFA9',
        'ok-300': '#AFE77E',
        'ok-600': '#61AC20',
        'ok-700': '#498118',
        warning: '#F0D732',
        'warning-default': '#FFC700',
        'warning-hover': '#FFB800',
        'warning-pressed': '#F5B000',
        sun: '#FDF7E7',
        'warning-stroke': '#F5D170',
        mandatory: '#EB6E38',
        attention: '#ED3E41',
        'attention-hover': '#C9302C',
        'attention-pressed': '#AC2925',
        'attention-stroke': '#CE6E6E',
        'attention-50': '#FDE8E8',
        'attention-300': '#F27375',
        'attention-700': '#8C0D0F',
        pink: '#D6267F',
        orange: '#FFC700',
        success: '#19A959',
        'success-hover': '#1F8A4F',
        'success-pressed': '#1A7543',
        'logo-yellow': '#F9DE4B',
        'gray-600': '#4b5563',
        /**Dark Blue Steel Theme */
        /**Branding Colours */

        sanJuan: '#434E63',
        toryBlue: '#144C91',
        darkBlue: '#12141A',
        violetBlue: '#1859AB',
        royalBlue: '#1F73DE',
        'royalBlue-50': '#E9F1FC',
        'royalBlue-100': '#D2E3F9',
        'royalBlue-200': '#A5C7F3',
        'royalBlue-300': '#79ABEC',
        'royalBlue-400': '#4C8FE6',
        'royalBlue-600': '#195CB3',
        lightRoyalBlue: '#B1CFF4',
        /** Greyish Colours */
        onyx: '#12141A',
        'onyx-80': '#12141A',
        'onyx-50': '#1A1E27',
        'onyx-25': '#1F232D',
        cinder: '#232833',
        blackRock: '#29303D',
        mirage: '#363D4A',
        licorice: '#323A4A',
        blueZodiac: '#3C4352',
        lightBlueZodiac: '#3C4352',
        graySuit: '#919499',
        zircon: '#DADEE6',
        'zircon-10': '#2E313A',
        'zircon-50': '#7F838C',
        'zircon-75': '#ACB0B9',
        /**Snowdrift Theme */
        /**Branding Colours */
        storm: '#3C4252',
        'storm-50': '#F0F1F4',
        'storm-100': '#E2E4E9',
        'storm-200': '#C4C8D4',
        'storm-300': '#A7ADBE',
        'storm-350': '#6C7793',
        'storm-400': '#8992A9',
        'storm-450': '#565F76',
        navy: '#0074A8',
        glacier: '#0098DC',
        /**Greyish Colours */
        charcoal: '#5C5C5C',
        'charcoal-75': '#858585',
        gray: '#8C8C8C',
        'gray-50': '#F2F2F2',
        'gray-200': '#CCCCCC',
        silver: '#C8C8C8',
        alto: '#D9D9D9',
        mercury: '#E6E6E6',
        stainedSnow: '#F7F7F7',
        snow: '#FFFFFF',
        snow50: '#929499',
        unclassified: '#78D428',
        restricted: '#F0D732',
        confidential: '#000077',
        secret: '#ED3E41',
        topsecret: '#FFAA00',
        splitBorder: '#4a5563',
        splitBorderLight: '#e5e7eb'
      }
    }
  },
  plugins: []
};
export default config;
