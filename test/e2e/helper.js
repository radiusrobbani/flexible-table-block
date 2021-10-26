/**
 * WordPress dependencies
 */
import { insertBlock, pressKeyWithModifier } from '@wordpress/e2e-test-utils';
export const coreTableSelector = '[data-type="core/table"]';
export const coreTableCellSelector = `${ coreTableSelector } td`;
export const flexibleTableSelector = '[data-type="flexible-table-block/table"]';
export const flexibleTableCellSelector = `${ flexibleTableSelector } td`;
export const flexibleTableCaptionSelector = `${ flexibleTableSelector } figcaption`;

/** @type {import('puppeteer').Page} */
const page = global.page;

export const createNewFlexibleTableBlock = async ( {
	col,
	row,
	header = false,
	footer = false,
} = {} ) => {
	await insertBlock( 'Flexible' );

	if ( header ) {
		await page.click( '.ftb-placeholder__toggle-header input' );
	}
	if ( footer ) {
		await page.click( '.ftb-placeholder__toggle-footer input' );
	}

	if ( col ) {
		await page.focus( '.ftb-placeholder__column-count input' );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( String( col ) );
	}

	if ( row ) {
		await page.focus( '.ftb-placeholder__row-count input' );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( String( row ) );
	}

	await page.waitForSelector( '.ftb-placeholder__form button' );
	await page.click( '.ftb-placeholder__form button' );
};

export const createNewCoreTableBlock = async ( { col, row } = {} ) => {
	await insertBlock( 'Table' );

	if ( col ) {
		await page.focus(
			'.blocks-table__placeholder-form .components-base-control:nth-child(1) .components-text-control__input'
		);
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( String( col ) );
	}

	if ( row ) {
		await page.focus(
			'.blocks-table__placeholder-form .components-base-control:nth-child(2) .components-text-control__input'
		);
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( String( row ) );
	}

	await page.waitForSelector( '.blocks-table__placeholder-button' );
	await page.click( '.blocks-table__placeholder-button' );
};

export const clickButtonWithAriaLabel = async ( parentSelector, label, index = 0 ) => {
	const selector = `${ parentSelector } button[aria-label="${ label }"]`;
	const elements = await page.$$( selector );
	if ( elements[ index ] ) {
		await elements[ index ].click();
	}
};

export const clickButtonWithText = async ( parentPath, text, index = 0 ) => {
	const xPath = `${ parentPath }//button[contains(.,"${ text }")]`;
	const elements = await page.$x( xPath );
	if ( elements[ index ] ) {
		await elements[ index ].click();
	}
};

export const clickToggleControlWithText = async ( text, index = 0 ) => {
	const xPath = `//label[contains(@class, "components-toggle-control__label")][text()="${ text }"]`;
	await page.waitForXPath( xPath );
	const elements = await page.$x( xPath );
	if ( elements[ index ] ) {
		await elements[ index ].click();
	}
};

export const selectOptionFromLabel = async ( label, value, index = 0 ) => {
	const xPath = `//label[contains(@class, "control__label")][text()="${ label }"]`;
	await page.waitForXPath( xPath );
	const elements = await page.$x( xPath );
	if ( elements[ index ] ) {
		const selectId = await page.evaluate(
			( element ) => element.getAttribute( 'for' ),
			elements[ index ]
		);
		await page.select( `#${ selectId }`, value );
	}
};

export const inputValueFromLabel = async ( label, value, index = 0 ) => {
	const xPath = `//label[contains(@class, "control__label")][text()="${ label }"]`;
	await page.waitForXPath( xPath );
	const elements = await page.$x( xPath );
	if ( elements[ index ] ) {
		const inputId = await page.evaluate(
			( element ) => element.getAttribute( 'for' ),
			elements[ index ]
		);
		await page.focus( `#${ inputId }` );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( String( value ) );
	}
};

export const inputValueFromLabelledBy = async ( labelledBy, value, index = 0 ) => {
	const selector = `[aria-labelledby="${ labelledBy }"] input`;
	await page.waitForSelector( selector );
	const elements = await page.$$( selector );
	if ( elements[ index ] ) {
		const inputId = await page.evaluate(
			( element ) => element.getAttribute( 'id' ),
			elements[ index ]
		);
		await page.focus( `#${ inputId }` );
		await pressKeyWithModifier( 'primary', 'a' );
		await page.keyboard.press( 'Delete' );
		await page.keyboard.type( String( value ) );
	}
};

export const openSidebar = async () => {
	await page.waitForSelector( '.edit-post-header [aria-label="Settings"]' );
	const [ sidebarButton ] = await page.$$(
		'.edit-post-header [aria-label="Settings"][aria-expanded="false"]'
	);
	if ( sidebarButton ) {
		await sidebarButton.click();
	}
};

export const openSidebarPanelWithTitle = async ( title, index = 0 ) => {
	await page.waitForXPath(
		`//div[contains(@class,"edit-post-sidebar")]//button[@class="components-button components-panel__body-toggle"][contains(.,"${ title }")]`
	);
	const panel = await page.$x(
		`//div[contains(@class,"edit-post-sidebar")]//button[@class="components-button components-panel__body-toggle"][@aria-expanded="false"][contains(.,"${ title }")]`
	);
	if ( panel[ index ] ) {
		await panel[ index ].click();
	}
};