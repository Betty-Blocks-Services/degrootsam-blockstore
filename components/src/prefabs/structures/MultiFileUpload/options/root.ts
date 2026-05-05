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

const members = ['rootOuterSpacing', 'rootInnerSpacing', 'errorColor'] satisfies Array<
  keyof typeof rootOptions
>;

export const rootCategory: OptionCategory = {
  label: 'Root',
  members,
};
