/** @type {import('stylelint').Config} */
const config = {
  extends: 'stylelint-config-standard-scss',
  rules: {
    'at-rule-no-deprecated': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
        ],
      },
    ],
  },
};

export default config;
