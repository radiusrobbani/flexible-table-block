/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { link, linkOff } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import {
	BaseControl,
	Button,
	Tooltip,
	// @ts-ignore
	__experimentalText as Text,
	// @ts-ignore
	__experimentalUnitControl as UnitControl,
	// @ts-ignore
	__experimentalUseCustomUnits as useCustomUnits,
} from '@wordpress/components';

/**
 * Internal dependencies
 */
import { PADDING_UNITS } from '../constants';
import { SIDES, SideIndicatorControl } from './indicator-control';
import type { Sides } from './indicator-control';

const DEFAULT_VALUES = {
	top: undefined,
	right: undefined,
	bottom: undefined,
	left: undefined,
};

type ValuesKey = keyof typeof DEFAULT_VALUES;

export default function PaddingControl( {
	id,
	label = __( 'Padding', 'flexible-table-block' ),
	help,
	className,
	onChange,
	values: valuesProp,
	allowSides = true,
	hasIndicator = true,
}: {
	id: string;
	label: string;
	help: string;
	className: string;
	onChange: ( event: any ) => void;
	values: typeof DEFAULT_VALUES;
	allowSides: boolean;
	hasIndicator: boolean;
} ) {
	const values = { ...DEFAULT_VALUES, ...valuesProp };

	const isMixed =
		allowSides &&
		! ( values.top === values.right && values.top === values.bottom && values.top === values.left );

	const paddingUnits = useCustomUnits( { availableUnits: PADDING_UNITS } );

	const [ isLinked, setIsLinked ] = useState< boolean >( true );
	const [ side, setSide ] = useState< Sides | undefined >( undefined );

	const headingId = `${ id }-heading`;

	const linkedLabel = isLinked
		? __( 'Unlink Sides', 'flexible-table-block' )
		: __( 'Link Sides', 'flexible-table-block' );

	const allInputPlaceholder = isMixed ? __( 'Mixed', 'flexible-table-block' ) : undefined;
	const allInputValue = isMixed ? undefined : values.top;

	const classNames = classnames( 'ftb-padding-control', className );

	const toggleLinked = () => {
		setIsLinked( ! isLinked );
		setSide( undefined );
	};

	const handleOnReset = () => {
		setIsLinked( true );
		onChange( {
			top: undefined,
			right: undefined,
			bottom: undefined,
			left: undefined,
		} );
	};

	const handleOnFocus = ( focusSide: Sides ) => setSide( focusSide );

	const handleOnChangeAll = ( inputValue: string ) => {
		onChange( {
			top: inputValue,
			right: inputValue,
			bottom: inputValue,
			left: inputValue,
		} );
	};

	const handleOnChange = ( inputValue: string, targetSide: Sides ) => {
		onChange( {
			...values,
			[ targetSide ]: inputValue,
		} );
	};

	return (
		<BaseControl id={ id } className={ classNames } help={ help }>
			<div aria-labelledby={ headingId } role="region">
				<div className="ftb-padding-control__header">
					<Text id={ headingId }>{ label }</Text>
					<Button isSmall isSecondary onClick={ handleOnReset }>
						{ __( 'Reset', 'flexible-table-block' ) }
					</Button>
				</div>
				<div className="ftb-padding-control__header-control">
					{ hasIndicator && (
						<SideIndicatorControl sides={ side === undefined ? undefined : [ side ] } />
					) }
					{ ( isLinked || ! allowSides ) && (
						<UnitControl
							placeholder={ allInputPlaceholder }
							aria-label={ __( 'All', 'flexible-table-block' ) }
							onChange={ handleOnChangeAll }
							value={ allInputValue }
							units={ paddingUnits }
						/>
					) }
					{ allowSides && (
						<Tooltip text={ linkedLabel }>
							<span>
								<Button
									isSmall
									isPrimary={ isLinked }
									isSecondary={ ! isLinked }
									onClick={ toggleLinked }
									icon={ isLinked ? link : linkOff }
									iconSize="16"
								/>
							</span>
						</Tooltip>
					) }
				</div>
				{ ! isLinked && allowSides && (
					<div className="ftb-padding-control__input-controls">
						{ SIDES.map( ( item ) => (
							<UnitControl
								key={ item.value }
								aria-label={ item.label }
								value={ values[ item.value as ValuesKey ] }
								units={ paddingUnits }
								onFocus={ () => handleOnFocus( item.value ) }
								onChange={ ( value: string ) => handleOnChange( value, item.value ) }
							/>
						) ) }
					</div>
				) }
			</div>
		</BaseControl>
	);
}