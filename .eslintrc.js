module.exports = {
    env: {
        browser: true,
        es2021: true,
    },
    extends: [
        'standard',
        'plugin:react/recommended',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        semi: [
            'error',
            'never',
        ],
        indent: [ 2, 4, { SwitchCase: 1 } ],
        'operator-linebreak': [ 'error', 'before' ],
        'comma-dangle': [ 'error', 'always-multiline' ],
        'quote-props': [ 'error', 'as-needed' ],
        'array-bracket-spacing': [ 'error', 'always', { singleValue: false } ],
        'new-cap': [ 2, { capIsNewExceptions: ['express.Router'] } ],
        'import/no-unresolved': [0],
        'prefer-reflect': [0],
        'import/no-anonymous-default-export': [0],
        'no-async-promise-executor': 'off',
        'no-case-declarations': 'off',
        'react/react-in-jsx-scope': 'off',
    },
    ignorePatterns: [ 'node_modules/', 'build/', 'node_build/' ],
}
