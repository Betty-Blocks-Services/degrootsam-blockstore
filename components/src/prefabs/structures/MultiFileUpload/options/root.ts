import { color, sizes, ThemeColor } from '@betty-blocks/component-sdk';

export const rootOptions = {
  rootOuterSpacing: sizes('Outer spacing', {
    value: ['0rem', '0rem', '0rem', '0rem'],
  }),
  errorColor: color('Error color', {
    value: ThemeColor.DANGER,
  }),
};

const members = ['rootOuterSpacing', 'errorColor'];

export const rootCategory = {
  label: 'Root',
  members,
};
