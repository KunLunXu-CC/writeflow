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
    'selector-class-pattern': '^([a-z][a-z0-9]*)(-[a-z0-9]+)*$|^selectedCell$',
    // 'selector-class-pattern': [
    //   true,
    //   {
    //     // 允许 prosemirror-tables 的硬编码类名
    //     ignoreSelectors: ['.selectedCell'],
    //   },
    // ],
  },
};

export default config;
