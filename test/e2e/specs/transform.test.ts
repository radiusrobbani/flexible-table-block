/**
 * WordPress dependencies
 */
import {
	getEditedPostContent,
	createNewPost,
	transformBlockTo,
	clickBlockToolbarButton,
	clickButton,
} from '@wordpress/e2e-test-utils';

/**
 * Internal dependencies
 */
import {
	createNewFlexibleTableBlock,
	createNewCoreTableBlock,
	coreTableCellSelector,
	flexibleTableCellSelector,
	flexibleTableCaptionSelector,
	clickButtonWithAriaLabel,
	clickButtonWithText,
	inputValueFromLabel,
	inputValueFromLabelledBy,
	clickToggleControlWithText,
	getWpVersion,
	openSidebar,
	openSidebarPanelWithTitle,
} from '../helper';

/** @type {import('puppeteer').Page} */
const page = global.page;

describe( 'Transform from core table block to flexible table block', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'should be transformed to flexible table block with no "Fixed width table cells" option', async () => {
		await createNewCoreTableBlock();
		const cells = await page.$$( coreTableCellSelector );
		await cells[ 0 ].click();
		await page.keyboard.type( 'Core Table Block' );
		await transformBlockTo( 'Flexible Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be transformed to flexible table block heeping header & footer section', async () => {
		const wpVersion = await getWpVersion();
		await createNewCoreTableBlock();
		await openSidebar();
		await clickToggleControlWithText( 'Header section' );
		await clickToggleControlWithText( 'Footer section' );
		await transformBlockTo( 'Flexible Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be transformed to flexible table block keeping "Fixed width table cells" option', async () => {
		const wpVersion = await getWpVersion();
		await createNewCoreTableBlock( { col: 6, row: 6 } );
		await openSidebar();
		await clickToggleControlWithText( 'Fixed width table cells' );
		await transformBlockTo( 'Flexible Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );
} );

describe( 'Transform from flexible table block to core table block', () => {
	beforeEach( async () => {
		await createNewPost();
	} );

	it( 'should be transformed to core table block keeping "Fixed width table cells" option', async () => {
		await createNewFlexibleTableBlock( { col: 3, row: 6 } );
		const cells = await page.$$( flexibleTableCellSelector );
		await cells[ 3 ].click();
		await page.keyboard.type( 'Flexible Table Block' );
		await transformBlockTo( 'Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be transformed to core table block with no "Fixed width table cells" option', async () => {
		await createNewFlexibleTableBlock( { col: 6, row: 3 } );
		const cells = await page.$$( flexibleTableCellSelector );
		await cells[ 0 ].click();
		await page.keyboard.type( 'Flexible Table Block' );
		await openSidebar();
		await openSidebarPanelWithTitle( 'Table settings' );
		await clickToggleControlWithText( 'Fixed width table cells' );
		await transformBlockTo( 'Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be transformed to core table block with no style & class table', async () => {
		await createNewFlexibleTableBlock( { col: 6, row: 3 } );
		await openSidebar();
		await openSidebarPanelWithTitle( 'Table settings' );
		await clickToggleControlWithText( 'Scroll on desktop view' );
		await inputValueFromLabel( 'Table width', '500' );
		await inputValueFromLabelledBy( 'flexible-table-block-table-padding-heading', '1' );
		await clickButtonWithAriaLabel(
			'[aria-labelledby="flexible-table-block-table-border-style-heading"]',
			'Solid'
		);
		await clickButton( 'Separate' );
		await transformBlockTo( 'Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be transformed to core table block with rowspan / colspan cells', async () => {
		const wpVersion = await getWpVersion();
		await createNewFlexibleTableBlock( { col: 5, row: 5 } );
		const cells = await page.$$( flexibleTableCellSelector );
		await cells[ 0 ].click();
		await page.keyboard.type( 'Cell 1' );
		await cells[ 1 ].click();
		await page.keyboard.type( 'Cell 2' );
		await cells[ 0 ].click();
		await page.keyboard.down( 'Shift' );
		await cells[ 1 ].click();
		await page.keyboard.up( 'Shift' );
		await clickBlockToolbarButton( 'Edit table' );
		await clickButton( 'Merge cells' );
		await transformBlockTo( 'Table' );

		// In WordPress 6.2, the core table block now supports rowspan and colspan attributes.
		const snapshot = [ '6-2', '6-3', '6-4' ].includes( wpVersion )
			? `<!-- wp:table {"hasFixedLayout":true} -->
<figure class="wp-block-table"><table class="has-fixed-layout"><tbody><tr><td colspan="2">Cell 1</td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></figure>
<!-- /wp:table -->`
			: `<!-- wp:table {"hasFixedLayout":true} -->
<figure class="wp-block-table"><table class="has-fixed-layout"><tbody><tr><td>Cell 1</td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td></tr></tbody></table></figure>
<!-- /wp:table -->`;
		expect( await getEditedPostContent() ).toBe( snapshot );
	} );

	it( 'should be transformed to core table block with no style & class cells', async () => {
		await createNewFlexibleTableBlock();
		const cells = await page.$$( flexibleTableCellSelector );
		await cells[ 0 ].click();
		await page.keyboard.type( 'Flexible Table Block' );
		await openSidebar();
		await openSidebarPanelWithTitle( 'Cell settings' );
		await inputValueFromLabel( 'Cell font size', '20' );
		await inputValueFromLabelledBy( 'flexible-table-block-cell-padding-heading', '1' );
		await clickButtonWithAriaLabel(
			'[aria-labelledby="flexible-table-block-cell-border-style-heading"]',
			'Solid'
		);
		await clickButtonWithText(
			'//*[@aria-labelledby="flexible-table-block-cell-tag-heading"]',
			'TH'
		);
		await transformBlockTo( 'Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be transformed to core table block with no unnecessary attributes cells', async () => {
		await createNewFlexibleTableBlock();
		const cells = await page.$$( flexibleTableCellSelector );
		await cells[ 0 ].click();
		await openSidebar();
		await openSidebarPanelWithTitle( 'Cell settings' );
		await clickButtonWithText(
			'//*[@aria-labelledby="flexible-table-block-cell-tag-heading"]',
			'TH'
		);
		await inputValueFromLabel( 'id attribute', 'id' );
		await inputValueFromLabel( 'headers attribute', 'headers' );
		await clickButtonWithText(
			'//*[@aria-labelledby="flexible-table-block-cell-scope-heading"]',
			'row'
		);
		await transformBlockTo( 'Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be transformed to core table block with appropriate tag cells', async () => {
		await createNewFlexibleTableBlock( { header: true, footer: true } );
		const cells = await page.$$( flexibleTableCellSelector );
		await cells[ 0 ].click();
		await openSidebar();
		await openSidebarPanelWithTitle( 'Cell settings' );
		await clickButtonWithText(
			'//*[@aria-labelledby="flexible-table-block-cell-tag-heading"]',
			'TD'
		);
		await cells[ 3 ].click();
		await clickButtonWithText(
			'//*[@aria-labelledby="flexible-table-block-cell-tag-heading"]',
			'TH'
		);
		await cells[ 12 ].click();
		await clickButtonWithText(
			'//*[@aria-labelledby="flexible-table-block-cell-tag-heading"]',
			'TH'
		);
		await transformBlockTo( 'Table' );
		expect( await getEditedPostContent() ).toMatchSnapshot();
	} );

	it( 'should be transformed to core table block keeping caption text', async () => {
		const wpVersion = await getWpVersion();
		await createNewFlexibleTableBlock();
		await page.$$( flexibleTableCaptionSelector );
		await page.focus( flexibleTableCaptionSelector );
		await page.keyboard.type( 'Flexible' );
		await page.keyboard.down( 'Shift' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.up( 'Shift' );
		await page.keyboard.type( 'Table' );
		await page.keyboard.down( 'Shift' );
		await page.keyboard.press( 'Enter' );
		await page.keyboard.up( 'Shift' );
		await page.keyboard.type( 'Block' );
		await transformBlockTo( 'Table' );

		// Figcaption has `.wp-element-caption` class in WordPress 6.1
		const snapshot = [ '6-1', '6-2', , '6-4' ].includes( wpVersion )
			? `<!-- wp:table {"hasFixedLayout":true} -->
<figure class="wp-block-table"><table class="has-fixed-layout"><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><figcaption class="wp-element-caption">Flexible<br>Table<br>Block</figcaption></figure>
<!-- /wp:table -->`
			: `<!-- wp:table {"hasFixedLayout":true} -->
<figure class="wp-block-table"><table class="has-fixed-layout"><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><figcaption>Flexible<br>Table<br>Block</figcaption></figure>
<!-- /wp:table -->`;

		expect( await getEditedPostContent() ).toBe( snapshot );
	} );

	it( 'should be transformed to core table block width no option caption text', async () => {
		const wpVersion = await getWpVersion();
		await createNewFlexibleTableBlock();
		await page.$$( flexibleTableCaptionSelector );
		await page.focus( flexibleTableCaptionSelector );
		await page.keyboard.type( 'Flexible Table Block' );
		await openSidebar();
		await openSidebarPanelWithTitle( 'Caption settings' );
		await inputValueFromLabel( 'Caption font size', '20' );
		await inputValueFromLabelledBy( 'flexible-table-block-caption-padding-heading', '20' );
		await clickButtonWithText(
			'//*[@aria-labelledby="flexible-table-block-caption-side-heading"]',
			'Top'
		);
		await transformBlockTo( 'Table' );

		// Figcaption has `.wp-element-caption` class in WordPress 6.1
		const snapshot = [ '6-1', '6-2', '6-3', '6-4' ].includes( wpVersion )
			? `<!-- wp:table {"hasFixedLayout":true} -->
<figure class="wp-block-table"><table class="has-fixed-layout"><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><figcaption class="wp-element-caption">Flexible Table Block</figcaption></figure>
<!-- /wp:table -->`
			: `<!-- wp:table {"hasFixedLayout":true} -->
<figure class="wp-block-table"><table class="has-fixed-layout"><tbody><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr><tr><td></td><td></td><td></td></tr></tbody></table><figcaption>Flexible Table Block</figcaption></figure>
<!-- /wp:table -->`;

		expect( await getEditedPostContent() ).toBe( snapshot );
	} );
} );
