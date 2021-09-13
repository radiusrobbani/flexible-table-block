/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import {
	BaseControl,
	Button,
	ButtonGroup,
	SelectControl,
	ToggleControl,
	__experimentalBoxControl as BoxControl,
	__experimentalUnitControl as UnitControl,
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

/**
 * Internal components
 */
import BorderRadiusControl from '../controls/border-radius-control';
import BorderWidthControl from '../controls/border-width-control';
import BorderStyleControl from '../controls/border-style-control';

import {
	BORDER_COLLAPSE_CONTROLS,
	STICKY_CONTROLS,
	TABLE_WIDTH_UNITS,
	BORDER_SPACING_UNITS,
} from '../utils/constants';
import { toggleSection } from '../utils/table-state';
import { toUnitVal } from '../utils/helper';
import { convertToInline } from '../utils/style-converter';
import { pickBorderWidth, pickBorderRadius, pickBorderSpacing } from '../utils/style-picker';
import {
	updateBorderWidthStyles,
	updateBorderRadiusStyles,
	updateBorderStyleStyles,
	updateBorderColorStyles,
	updateBorderSpacingStyles,
} from '../utils/style-updater';

export default function TableSettings( props ) {
	const { tableStylesObj, attributes, setAttributes } = props;
	const { hasFixedLayout, sticky, head, foot } = attributes;

	const tableWidthUnits = useCustomUnits( {
		availableUnits: TABLE_WIDTH_UNITS,
	} );

	const borderSpacingUnits = useCustomUnits( {
		availableUnits: BORDER_SPACING_UNITS,
	} );

	const onChangeFixedLayout = () => {
		setAttributes( { hasFixedLayout: ! hasFixedLayout } );
	};

	const onChangeSticky = ( value ) => {
		setAttributes( { sticky: 'none' === value ? undefined : value } );
	};

	const onToggleHeaderSection = () => {
		setAttributes( toggleSection( attributes, 'head' ) );
	};

	const onToggleFooterSection = () => {
		setAttributes( toggleSection( attributes, 'foot' ) );
	};

	const onChangeWidth = ( value ) => {
		setAttributes( {
			tableStyles: convertToInline( {
				...tableStylesObj,
				width: toUnitVal( value ),
			} ),
		} );
	};

	const onChangeMaxWidth = ( value ) => {
		setAttributes( {
			tableStyles: convertToInline( {
				...tableStylesObj,
				maxWidth: toUnitVal( value ),
			} ),
		} );
	};

	const onChangeMinWidth = ( value ) => {
		setAttributes( {
			tableStyles: convertToInline( {
				...tableStylesObj,
				minWidth: toUnitVal( value ),
			} ),
		} );
	};

	const onChangeBorderWidth = ( values ) => {
		const newStylesObj = updateBorderWidthStyles( tableStylesObj, values );
		setAttributes( { tableStyles: convertToInline( newStylesObj ) } );
	};

	const onChangeBorderRadius = ( values ) => {
		const newStylesObj = updateBorderRadiusStyles( tableStylesObj, values );
		setAttributes( { tableStyles: convertToInline( newStylesObj ) } );
	};

	const onChangeBorderStyle = ( values ) => {
		const newStylesObj = updateBorderStyleStyles( tableStylesObj, values );
		setAttributes( { tableStyles: convertToInline( newStylesObj ) } );
	};

	const onChangeBorderCollor = ( values ) => {
		const newStylesObj = updateBorderColorStyles( tableStylesObj, values );
		setAttributes( { tableStyles: convertToInline( newStylesObj ) } );
	};

	const onChangeBorderCollapse = ( value ) => {
		const borderCollapse = tableStylesObj?.borderCollapse === value ? undefined : value;
		const borderSpacing = 'separate' === borderCollapse ? tableStylesObj?.borderSpacing : undefined;

		setAttributes( {
			tableStyles: convertToInline( {
				...tableStylesObj,
				borderCollapse,
				borderSpacing,
			} ),
		} );
	};

	const onChangeBorderSpacing = ( values ) => {
		const newStylesObj = updateBorderSpacingStyles( tableStylesObj, values );
		setAttributes( { tableStyles: convertToInline( newStylesObj ) } );
	};

	return (
		<>
			<BorderRadiusControl
				id="flexible-table-block/border-radius"
				onChange={ onChangeBorderRadius }
				values={ pickBorderRadius( tableStylesObj ) }
			/>
			<BorderWidthControl
				id="flexible-table-block/border-width"
				onChange={ onChangeBorderWidth }
				values={ pickBorderWidth( tableStylesObj ) }
			/>
			<BorderStyleControl
				id="flexible-table-block/border-style"
				onChange={ onChangeBorderStyle }
				values={ tableStylesObj?.borderStyle }
			/>
			<hr />
			<ToggleControl
				label={ __( 'Fixed width table cells', 'flexible-table-block' ) }
				checked={ !! hasFixedLayout }
				onChange={ onChangeFixedLayout }
			/>
			<ToggleControl
				label={ __( 'Header section', 'flexible-table-block' ) }
				checked={ !! ( head && head.length ) }
				onChange={ onToggleHeaderSection }
			/>
			<ToggleControl
				label={ __( 'Footer section', 'flexible-table-block' ) }
				checked={ !! ( foot && foot.length ) }
				onChange={ onToggleFooterSection }
			/>
			<SelectControl
				label={ __( 'Fixed control', 'flexible-table-block' ) }
				value={ sticky }
				onChange={ onChangeSticky }
				options={ STICKY_CONTROLS.map( ( { label, value } ) => {
					return { label, value };
				} ) }
			/>
			<hr />
			<BaseControl label={ __( 'Width', 'flexible-table-block' ) } id="flexible-table-block/width">
				<UnitControl
					labelPosition="top"
					min="0"
					value={ tableStylesObj?.width }
					onChange={ onChangeWidth }
					units={ tableWidthUnits }
				/>
				<ButtonGroup aria-label={ __( 'Percentage width' ) } className="ftb-percent-group">
					{ [ 25, 50, 75, 100 ].map( ( perWidth ) => {
						const isPressed = tableStylesObj?.width === `${ perWidth }%`;
						return (
							<Button
								key={ perWidth }
								isSmall
								isPressed={ isPressed }
								onClick={ () => onChangeWidth( isPressed ? undefined : `${ perWidth }%` ) }
							>
								{ `${ perWidth }%` }
							</Button>
						);
					} ) }
				</ButtonGroup>
			</BaseControl>
			<BaseControl
				label={ __( 'Max Width', 'flexible-table-block' ) }
				id="flexible-table-block/max-width"
			>
				<UnitControl
					labelPosition="top"
					min="0"
					value={ tableStylesObj?.maxWidth }
					onChange={ onChangeMaxWidth }
					units={ tableWidthUnits }
				/>
				<ButtonGroup aria-label={ __( 'Percentage max width' ) } className="ftb-percent-group">
					{ [ 25, 50, 75, 100 ].map( ( perWidth ) => {
						const isPressed = tableStylesObj?.maxWidth === `${ perWidth }%`;
						return (
							<Button
								key={ perWidth }
								isSmall
								isPressed={ isPressed }
								onClick={ () => onChangeMaxWidth( isPressed ? undefined : `${ perWidth }%` ) }
							>
								{ `${ perWidth }%` }
							</Button>
						);
					} ) }
				</ButtonGroup>
			</BaseControl>
			<BaseControl
				label={ __( 'Min Width', 'flexible-table-block' ) }
				id="flexible-table-block/min-width"
			>
				<UnitControl
					labelPosition="top"
					min="0"
					value={ tableStylesObj?.minWidth }
					onChange={ onChangeMinWidth }
					units={ tableWidthUnits }
				/>
				<ButtonGroup aria-label={ __( 'Percentage min width' ) } className="ftb-percent-group">
					{ [ 25, 50, 75, 100 ].map( ( perWidth ) => {
						const isPressed = tableStylesObj?.minWidth === `${ perWidth }%`;
						return (
							<Button
								key={ perWidth }
								isSmall
								isPressed={ isPressed }
								onClick={ () => onChangeMinWidth( isPressed ? undefined : `${ perWidth }%` ) }
							>
								{ `${ perWidth }%` }
							</Button>
						);
					} ) }
				</ButtonGroup>
			</BaseControl>
			<hr />
			<BaseControl
				label={ __( 'Cell borders', 'flexible-table-block' ) }
				id="flexible-table-block/border-collapse"
			>
				<ButtonGroup className="ftb-button-group">
					{ BORDER_COLLAPSE_CONTROLS.map( ( { label, value } ) => {
						return (
							<Button
								key={ value }
								variant={ value === tableStylesObj?.borderCollapse ? 'primary' : 'secondary' }
								onClick={ () => onChangeBorderCollapse( value ) }
							>
								{ label }
							</Button>
						);
					} ) }
				</ButtonGroup>
			</BaseControl>
			{ 'separate' === tableStylesObj?.borderCollapse && (
				<BoxControl
					values={ pickBorderSpacing( tableStylesObj ) }
					onChange={ onChangeBorderSpacing }
					label={ __( 'Border spacing', 'flexible-table-block' ) }
					units={ borderSpacingUnits }
					splitOnAxis={ true }
				/>
			) }
		</>
	);
}
