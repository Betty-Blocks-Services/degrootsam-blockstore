import {
  color,
  font,
  option,
  OptionCategory,
  ThemeColor,
} from '@betty-blocks/component-sdk';

export const fileSectionTitleOptions = {
  fileSectionTitleFontType: font('Text style', { value: ['Body1'] }),
  fileSectionTitleFontColor: color('Text color', {
    value: ThemeColor.BLACK,
    configuration: {
      hasThemeInherit: true,
    },
  }),
  fileSectionTitleFontWeight: option('CUSTOM', {
    label: 'Font weight',
    value: '[Inherit]',
    configuration: {
      as: 'DROPDOWN',
      dataType: 'string',
      allowedInput: [
        { name: '[Theme text style inheritance]', value: '[Inherit]' },
        { name: '100', value: '100' },
        { name: '200', value: '200' },
        { name: '300', value: '300' },
        { name: '400', value: '400' },
        { name: '500', value: '500' },
        { name: '600', value: '600' },
        { name: '700', value: '700' },
        { name: '800', value: '800' },
        { name: '900', value: '900' },
      ],
    },
  }),
};

const members: Array<keyof typeof fileSectionTitleOptions> = [
  'fileSectionTitleFontColor',
  'fileSectionTitleFontWeight',
  'fileSectionTitleFontType',
];

export const fileSectionTitleCategory: OptionCategory = {
  label: 'File list title',
  members,
};
