module.exports = [
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        console: 'readonly',
        __dirname: 'readonly',
        module: 'readonly',
        require: 'readonly',
        process: 'readonly'
      }
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'off'
    }
  }
]