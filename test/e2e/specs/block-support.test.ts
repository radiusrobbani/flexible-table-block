/**
 * WordPress dependencies
 */
import { getEditedPostContent, createNewPost } from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	getWpVersion,
	createNewFlexibleTableBlock,
	openSidebar,
	toggleToolsPanelMenu,
	clickButtonWithAriaLabel,
	clickButtonWithText,
	inputValueFromLabel,
	inputValueFromAriaLabel,
	selectOptionFromLabel,
} from '../helper';

/** @type {import('puppeteer').Page} */
const page = global.page;

describe( 'Block Support', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'typography settings should be applied', async () => {
		const wpVersion = await getWpVersion();

		await createNewFlexibleTableBlock();
		await openSidebar();

		if ( [ '6-2', '6-3', '6-4' ].includes( wpVersion ) ) {
			await clickButtonWithAriaLabel( '.edit-post-sidebar', 'Styles' );
		}

		if ( [ '6-1', '6-2', '6-3', '6-4' ].includes( wpVersion ) ) {
			await toggleToolsPanelMenu();
			for ( let i = 0; i < 6; i++ ) {
				const selector = 'div[aria-label="Typography options"] button.components-menu-item__button';
				const elements = await page.$$( selector );
				await elements[ i ].click();
			}
			await toggleToolsPanelMenu();
		} else {
			for ( let i = 0; i < 6; i++ ) {
				await toggleToolsPanelMenu();
				const selector =
					i === 0
						? 'div[aria-label="View and add options"] button.components-menu-item__button'
						: 'div[aria-label="View options"] button.components-menu-item__button';
				const elements = await page.$$( selector );
				await elements[ i ].click();
			}
		}

		const fontFamilyLabel = [ '6-1', '6-2', '6-3', '6-4' ].includes( wpVersion )
			? 'Font'
			: 'Font family';
		await selectOptionFromLabel( fontFamilyLabel, '"Source Serif Pro", serif' );
		await clickButtonWithAriaLabel( '.components-font-size-picker', 'Large' );
		await clickButtonWithAriaLabel( '.typography-block-support-panel', 'Appearance' );

		page.waitForTimeout( 3000 );
		for ( let i = 0; i < 5; i++ ) {
			await page.keyboard.press( 'ArrowDown' );
		}
		await page.keyboard.press( 'Enter' );
		await inputValueFromLabel( 'Line height', '3' );
		await clickButtonWithAriaLabel( '.typography-block-support-panel', 'Lowercase' );

		if ( [ '6-1', '6-2', '6-3', '6-4' ].includes( wpVersion ) ) {
			await inputValueFromLabel( 'Letter spacing', '10' );
		} else {
			await page.focus( 'input[aria-label="Letter-spacing"], input[aria-label="Letter spacing"]' );
			await page.keyboard.type( '10' );
		}

		// WordPress 6.1 has a different inline style order generated by block support
		const snapshot = [ '6-1', '6-2', '6-3', '6-4' ].includes( wpVersion )
			? `<!-- wp:flexible-table-block/table {"style":{"typography":{"fontStyle":"normal","fontWeight":"500","lineHeight":"3","textTransform":"lowercase","letterSpacing":"10px"}},"fontSize":"large","fontFamily":"source-serif-pro"} -->
<figure class="wp-block-flexible-table-block-table has-source-serif-pro-font-family has-large-font-size" style="font-style:normal;font-weight:500;letter-spacing:10px;line-height:3;text-transform:lowercase"><table class="has-fixed-layout"><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table></figure>
<!-- /wp:flexible-table-block/table -->`
			: `<!-- wp:flexible-table-block/table {"style":{"typography":{"fontStyle":"normal","fontWeight":"500","lineHeight":"3","textTransform":"lowercase","letterSpacing":"10px"}},"fontSize":"large","fontFamily":"source-serif-pro"} -->
<figure class="wp-block-flexible-table-block-table has-source-serif-pro-font-family has-large-font-size" style="font-style:normal;font-weight:500;line-height:3;text-transform:lowercase;letter-spacing:10px"><table class="has-fixed-layout"><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table></figure>
<!-- /wp:flexible-table-block/table -->`;

		expect( await getEditedPostContent() ).toBe( snapshot );
	} );

	it( 'dimensions settings should be applied', async () => {
		const wpVersion = await getWpVersion();

		await createNewFlexibleTableBlock();
		await openSidebar();

		if ( [ '6-2', '6-3', '6-4' ].includes( wpVersion ) ) {
			await clickButtonWithAriaLabel( '.edit-post-sidebar', 'Styles' );
		}

		await toggleToolsPanelMenu( 'dimensions' );
		await page.click( `button[aria-label="Show Margin"]` );
		await toggleToolsPanelMenu( 'dimensions' );

		if ( wpVersion === '6' ) {
			await clickButtonWithAriaLabel( '.dimensions-block-support-panel', 'Unlink Sides' );
		} else if ( [ '6-1', '6-2' ].includes( wpVersion ) ) {
			await clickButtonWithAriaLabel( '.dimensions-block-support-panel', 'Unlink sides' );
		} else {
			await clickButtonWithAriaLabel( '.dimensions-block-support-panel', 'Margin options' );
			await clickButtonWithText( '//div[@aria-label="Margin options"]', 'Custom' );
		}

		if ( [ '6-1', '6-2', '6-3', '6-4' ].includes( wpVersion ) ) {
			for ( let i = 0; i < 4; i++ ) {
				await clickButtonWithAriaLabel( '.dimensions-block-support-panel', 'Set custom size' );
			}
			await inputValueFromLabel( 'Top margin', '10' );
			await inputValueFromLabel( 'Right margin', '20' );
			await inputValueFromLabel( 'Bottom margin', '30' );
			await inputValueFromLabel( 'Left margin', '40' );
		} else {
			await inputValueFromAriaLabel( '.dimensions-block-support-panel', 'Top', '10' );
			await inputValueFromAriaLabel( '.dimensions-block-support-panel', 'Right', '20' );
			await inputValueFromAriaLabel( '.dimensions-block-support-panel', 'Bottom', '30' );
			await inputValueFromAriaLabel( '.dimensions-block-support-panel', 'Left', '40' );
		}
		await page.keyboard.press( 'Enter' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );
