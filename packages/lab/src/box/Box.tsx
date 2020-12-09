import {
  Color,
  ColorProp,
  isColorProp,
  parseResponsiveProp,
  parseSpaceProp,
  ResponsiveProp,
  SpaceProp,
} from '@superdispatch/ui';
import { Property } from 'csstype';
import { ForwardRefExoticComponent, ReactNode, Ref } from 'react';
import styled, { CSSObject } from 'styled-components';

import { createRuleNormalizer, RuleNormalizer } from '../utils/RuleNormalizer';

//
// Colors
//

function normalizeColor(input: unknown): string | undefined {
  return isColorProp(input) ? Color[input] : undefined;
}

//
// Space
//

function parseSpace(space: unknown): string {
  return `${parseSpaceProp(space as SpaceProp)}px`;
}

//
// Margins
//

export type MarginProp = SpaceProp | 'auto';
function parseMargin(margin: unknown): string {
  switch (margin as MarginProp) {
    case 'auto':
      return 'auto';
    default:
      return parseSpace(margin);
  }
}

//
// Borders
//

export type BorderRadiusProp = 'none' | 'small';
const normalizeBorderRadius = createRuleNormalizer<BorderRadiusProp>({
  none: 0,
  small: 4,
});

export type BorderWidthProp = 'none' | 'small' | 'large';
const normalizeBorderWidth = createRuleNormalizer<BorderWidthProp>({
  none: 0,
  small: 1,
  large: 4,
});

//
// Rules
//

interface BoxRules {
  color?: ResponsiveProp<ColorProp>;
  backgroundColor?: ResponsiveProp<ColorProp>;

  borderColor?: ResponsiveProp<ColorProp>;
  borderTopColor?: ResponsiveProp<ColorProp>;
  borderLeftColor?: ResponsiveProp<ColorProp>;
  borderRightColor?: ResponsiveProp<ColorProp>;
  borderBottomColor?: ResponsiveProp<ColorProp>;

  borderWidth?: ResponsiveProp<BorderWidthProp>;
  borderTopWidth?: ResponsiveProp<BorderWidthProp>;
  borderLeftWidth?: ResponsiveProp<BorderWidthProp>;
  borderRightWidth?: ResponsiveProp<BorderWidthProp>;
  borderBottomWidth?: ResponsiveProp<BorderWidthProp>;

  padding?: ResponsiveProp<SpaceProp>;
  paddingTop?: ResponsiveProp<SpaceProp>;
  paddingLeft?: ResponsiveProp<SpaceProp>;
  paddingRight?: ResponsiveProp<SpaceProp>;
  paddingBottom?: ResponsiveProp<SpaceProp>;

  margin?: ResponsiveProp<MarginProp>;
  marginTop?: ResponsiveProp<MarginProp>;
  marginLeft?: ResponsiveProp<MarginProp>;
  marginRight?: ResponsiveProp<MarginProp>;
  marginBottom?: ResponsiveProp<MarginProp>;

  borderRadius?: ResponsiveProp<BorderRadiusProp>;

  width?: Property.Width;
  maxWidth?: Property.MaxWidth;
  minWidth?: Property.MinWidth;

  height?: Property.Height;
  maxHeight?: Property.MaxHeight;
  minHeight?: Property.MinHeight;

  overflow?: Property.Overflow;
  overflowY?: Property.OverflowY;
  overflowX?: Property.OverflowX;
}

const normalizers: Record<keyof BoxRules, undefined | RuleNormalizer> = {
  color: normalizeColor,
  backgroundColor: normalizeColor,

  borderColor: normalizeColor,
  borderTopColor: normalizeColor,
  borderLeftColor: normalizeColor,
  borderRightColor: normalizeColor,
  borderBottomColor: normalizeColor,

  borderWidth: normalizeBorderWidth,
  borderTopWidth: normalizeBorderWidth,
  borderLeftWidth: normalizeBorderWidth,
  borderRightWidth: normalizeBorderWidth,
  borderBottomWidth: normalizeBorderWidth,

  margin: parseMargin,
  marginTop: parseMargin,
  marginLeft: parseMargin,
  marginRight: parseMargin,
  marginBottom: parseMargin,

  padding: parseSpace,
  paddingTop: parseSpace,
  paddingLeft: parseSpace,
  paddingRight: parseSpace,
  paddingBottom: parseSpace,

  borderRadius: normalizeBorderRadius,

  width: undefined,
  maxWidth: undefined,
  minWidth: undefined,

  height: undefined,
  maxHeight: undefined,
  minHeight: undefined,

  overflow: undefined,
  overflowY: undefined,
  overflowX: undefined,
};

function injectRule(
  styles: CSSObject,
  key: string,
  breakpoint: string,
  value: unknown,
  normalizer: undefined | RuleNormalizer,
): void {
  if (normalizer != null) {
    value = normalizer(value);
  }

  if (value != null) {
    let rules = styles[breakpoint];

    if (typeof rules != 'object') {
      rules = {};
      styles[breakpoint] = rules;
    }

    rules[key] = String(value);
  }
}

//
// Box
//

export interface BoxProps extends BoxRules {
  ref?: Ref<unknown>;
  children?: ReactNode;
  as?: keyof JSX.IntrinsicElements;
}

export const Box: ForwardRefExoticComponent<BoxProps> = styled.div<BoxProps>(
  (props) => {
    const { breakpoints } = props.theme;
    const xs = breakpoints.up('xs');
    const sm = breakpoints.up('sm');
    const md = breakpoints.up('md');

    const styles: CSSObject = {
      margin: 0,
      padding: 0,
      borderWidth: 0,
      borderStyle: 'solid',
    };

    for (const k in props) {
      if (Object.prototype.hasOwnProperty.call(props, k)) {
        const key = k as keyof BoxRules;
        const prop = props[key];

        if (prop != null && key in normalizers) {
          const [mobile, tablet, desktop] = parseResponsiveProp(prop);

          const normalizer = normalizers[key];

          injectRule(styles, key, xs, mobile, normalizer);
          injectRule(styles, key, sm, tablet, normalizer);
          injectRule(styles, key, md, desktop, normalizer);
        }
      }
    }

    return styles;
  },
);
