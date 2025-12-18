/** @type {import('stylelint').Config} */
const config = {
  extends: 'stylelint-config-standard-scss',
  rules: {
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['plugin', 'apply', 'source'],
      },
    ],
    'no-unknown-custom-properties': null,
    'selector-class-pattern':
      '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$|^selectedCell|^ProseMirror(-[a-z0-9]+)*$',
  },
};

export default config;
