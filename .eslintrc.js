module.exports = {
	extends: [
		'plugin:@wordpress/eslint-plugin/recommended',
		'plugin:@typescript-eslint/eslint-recommended',
	],
	plugins: [ '@typescript-eslint' ],
	parser: '@typescript-eslint/parser',
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'off',
		'import/no-duplicates': [
			'error',
			{
				considerQueryString: true,
				'prefer-inline': true,
			},
		],
		'@wordpress/no-unsafe-wp-apis': 'off',
		'@typescript-eslint/no-duplicate-imports': 'off',
		'jsdoc/require-param-type': 0,
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				tabWidth: 2,
				singleQuote: true,
				printWidth: 100,
				bracketSpacing: true,
				parenSpacing: true,
				bracketSameLine: false,
			},
		],
	},
	overrides: [
		{
			files: [
				'**/test/**/*.ts',
				'**/test/**/*.js',
				'**/__tests__/**/*.ts',
				'**/__tests__/**/*.js',
				'**/*.spec.ts',
				'**/*.spec.js',
			],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-unit' ],
			settings: {
				jest: {
					version: 26,
				},
			},
		},
		{
			files: [ 'test/e2e/**/*.js', 'test/e2e/**/*.ts' ],
			extends: [ 'plugin:@wordpress/eslint-plugin/test-e2e' ],
			rules: {
				'jest/expect-expect': 'off',
			},
		},
	],
};
