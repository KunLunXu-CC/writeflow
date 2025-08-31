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
    'no-unknown-custom-properties': true, // css 变量支持
    'selector-class-pattern':
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$|^selectedCell|^ProseMirror(-[a-z0-9]+)*$',
  },
};

export default config;
