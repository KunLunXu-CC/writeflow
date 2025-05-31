/** @type {import('stylelint').Config} */
export default {
  extends: 'stylelint-config-standard-scss',
  rules: {
    // "scss/at-rule-no-unknown": true,
    'at-rule-no-unknown': null,
    'scss/at-rule-no-unknown': true,
    // 'scss/selector-no-interpolation': false,
    // 'at-rule-no-unknown': [
    //   true,
    //   {
    //     ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen'],
    //   },
    // ],
  },
};
