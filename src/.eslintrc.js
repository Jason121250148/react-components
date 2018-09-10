const eslintrc = {
  root: true,
  extends: 'airbnb',
  env: {
    browser: true,
    node: true,
    commonjs: true,
    jest: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      classes: true,
      defaultParams: true,
      experimentalObjectRestSpread: true,
    },
  },
  plugins: [
    'import',
    'flowtype',
    'jsx-a11y',
    'react',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    'quotes': [2, 'single'],
    'import/no-extraneous-dependencies': 0,
    'import/prefer-default-export': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-plusplus': 0,
    'no-mixed-operators': 0,
    'space-before-function-paren': 0,
    'semi': ['error', 'never'],
    'no-return-assign': 0,
    'no-bitwise': 0,

    'react/jsx-filename-extension': 0,
    'react/prefer-stateless-function': 0,
    'react/prop-types': [2, { ignore: ['children'] }],
    'react/forbid-prop-types': [2, { forbid: ['any'] }],
    'react/no-find-dom-node': 0,

    'jsx-a11y/label-has-for': 0,
    'jsx-a11y/no-static-element-interactions': 0,

    /*---------------------upgrade airbnb from 14 to 16----------------------------*/
    "object-curly-newline": 0,
    "prefer-destructuring": 0,
    "function-paren-newline": 0,
    'padded-blocks': 0,
    'indent': 0,
    'no-multi-spaces': 0,
    'prefer-promise-reject-errors': 0,
    'no-restricted-globals': 0,

    'react/no-unused-state': 0,
    'react/jsx-max-props-per-line': 0,
    'react/jsx-closing-tag-location': 0,
    'react/jsx-curly-brace-presence': 0,
    'react/jsx-wrap-multilines': 0,
    'react/no-redundant-should-component-update': 0,
    'react/default-props-match-prop-types': 0,    
    'react/no-unused-prop-types': 0,

    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/media-has-caption': 0,
    'jsx-a11y/interactive-supports-focus': 0,
    'jsx-a11y/click-events-have-key-events': 0,  
    'jsx-a11y/anchor-is-valid': 0,
    'jsx-a11y/no-noninteractive-tabindex': 0,

    /* -------------------------close these rules-----------------------*/
    'lines-between-class-members': 0,
    'react/no-access-state-in-setstate': 0,
    'react/destructuring-assignment': 0,
    'eol-last': 0,
    'no-console': 0,
    'max-len': 0,
  },
  globals: {
    __DEV__: true,
    __PROD__: true,
    __BASE_PATH: false,
  },
};

module.exports = eslintrc;
