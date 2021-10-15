module.exports = {
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	rules: {
		'import/no-extraneous-dependencies': 'off',
		'import/no-unresolved': 'off',
		'@wordpress/no-unsafe-wp-apis': 'off',
		'prettier/prettier': [
			'error',
			{
				useTabs: true,
				tabWidth: 2,
				singleQuote: true,
				printWidth: 100,
				bracketSpacing: true,
				parenSpacing: true,
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
	],
};
