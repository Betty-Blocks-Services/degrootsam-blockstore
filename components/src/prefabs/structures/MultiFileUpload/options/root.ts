import {
  color,
  OptionCategory,
  sizes,
  ThemeColor,
  toggle,
} from '@betty-blocks/component-sdk';

export const rootOptions = {
  rootOuterSpacing: sizes('Outer spacing', {
    value: ['0rem', '0rem', '0rem', '0rem'],
  }),
  rootInnerSpacing: sizes('Inner spacing', {
    value: ['M', 'M', 'M', 'M'],
  }),
  errorColor: color('Error color', {
    value: ThemeColor.DANGER,
  }),
};

const members: Array<keyof typeof rootOptions> = ['rootOuterSpacing', 'rootInnerSpacing', 'errorColor'];

export const rootCategory: OptionCategory = {
  label: 'Root',
  members,
};
