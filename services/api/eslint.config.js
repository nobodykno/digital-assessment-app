import js from '@eslint/js';


export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**','src/test/**',
        '**/*.test.ts',
        '**/*.spec.ts',],
  },
);