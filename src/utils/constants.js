/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

import {
	alignLeft,
	alignRight,
	alignCenter,
	lineDashed,
	lineDotted,
	lineSolid
} from '@wordpress/icons';

export const PREVIEW_TABLE_HEIGHT_MIN = 200;


export const ALIGNMENT_CONTROLS = [
	{
		icon: alignLeft,
		title: __( 'Align column left', 'flexible-table-block' ),
		align: 'left'
	},
	{
		icon: alignCenter,
		title: __( 'Align column center', 'flexible-table-block' ),
		align: 'center'
	},
	{
		icon: alignRight,
		title: __( 'Align column right', 'flexible-table-block' ),
		align: 'right'
	}
];

export const CELL_ARIA_LABEL = {
	head: __( 'Header cell text', 'flexible-table-block' ),
	body: __( 'Body cell text', 'flexible-table-block' ),
	foot: __( 'Footer cell text', 'flexible-table-block' )
};

export const SECTION_PLACEHOLDER = {
	head: __( 'Header label', 'flexible-table-block' ),
	foot: __( 'Footer label', 'flexible-table-block' )
};
