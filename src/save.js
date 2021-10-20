/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
import {
	RichText,
	useBlockProps,
	__experimentalGetColorClassesAndStyles as getColorClassesAndStyles,
} from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import { convertToObject } from './utils/style-converter';

export default function save( { attributes } ) {
	const {
		contentJustification,
		tableStyles,
		hasFixedLayout,
		isStackedOnMobile,
		isScrollOnPc,
		isScrollOnMobile,
		sticky,
		head,
		body,
		foot,
		caption,
		captionSide,
		captionStyles,
	} = attributes;

	const isEmpty = ! head.length && ! body.length && ! foot.length;

	if ( isEmpty ) return null;

	const tableStylesObj = convertToObject( tableStyles );
	const captionStylesObj = convertToObject( captionStyles );

	const colorProps = getColorClassesAndStyles( attributes );

	const blockProps = useBlockProps.save( {
		className: classnames( {
			[ `is-content-justification-${ contentJustification }` ]: contentJustification,
			'is-scroll-on-pc': isScrollOnPc,
			'is-scroll-on-mobile': isScrollOnMobile,
		} ),
	} );

	const tableClasses = classnames( colorProps.className, {
		'has-fixed-layout': hasFixedLayout,
		'is-stacked-on-mobile': isStackedOnMobile,
		[ `is-sticky-${ sticky }` ]: sticky,
	} );

	const hasCaption = ! RichText.isEmpty( caption );

	const Section = ( { type, rows } ) => {
		const Tag = `t${ type }`;

		return (
			<Tag>
				{ rows.map( ( { cells }, rowIndex ) => (
					<tr key={ rowIndex }>
						{ cells.map( ( { content, tag, className, rowSpan, colSpan, styles }, cellIndex ) => (
							<RichText.Content
								key={ cellIndex }
								tagName={ tag }
								className={ className }
								value={ content }
								rowSpan={ rowSpan > 1 ? rowSpan : undefined }
								colSpan={ colSpan > 1 ? colSpan : undefined }
								style={ convertToObject( styles ) }
							/>
						) ) }
					</tr>
				) ) }
			</Tag>
		);
	};

	const Caption = () => (
		<RichText.Content tagName="figcaption" value={ caption } style={ captionStylesObj } />
	);

	return (
		<figure { ...blockProps }>
			{ hasCaption && 'top' === captionSide && <Caption /> }
			<table
				className={ tableClasses ?? undefined }
				style={ { ...tableStylesObj, ...colorProps.style } }
			>
				<Section type="head" rows={ head } />
				<Section type="body" rows={ body } />
				<Section type="foot" rows={ foot } />
			</table>
			{ hasCaption && 'bottom' === captionSide && <Caption /> }
		</figure>
	);
}
