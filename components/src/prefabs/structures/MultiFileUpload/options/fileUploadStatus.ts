import {
  option,
  color,
  buttongroup,
  OptionCategory,
  font,
  ThemeColor,
} from '@betty-blocks/component-sdk';

export const fileUploadStatusUptions = {
  fileUploadStatusFontType: font('Text style', { value: ['Body1'] }),
  fileUploadStatusPendingFontColor: color("'Pending' text color", {
    value: ThemeColor.BLACK,
    configuration: {
      hasThemeInherit: true,
    },
  }),

  fileUploadStatusFontWeight: option('CUSTOM', {
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

  fileUploadStatusProgressWidth: option('SIZE', {
    label: 'Progress bar width',
    value: '150px',
    configuration: {
      as: 'UNIT',
    },
  }),

  fileUploadStatusProgressBackground: color('Progress background color', {
    value: '#daf5f9',
  }),
  fileUploadStatusUploadingColor: color("'Uploading' text color", {
    value: '#0aa8bc',
    configuration: {
      hasThemeInherit: true,
    },
  }),
  fileUploadStatusFinishedColor: color("'Finished' color", {
    value: ThemeColor.SUCCESS,
  }),
  fileUploadStatusTextTransform: buttongroup(
    'Progress text transform',
    [
      ['None', 'none'],
      ['Capitalize', 'capitalize'],
      ['Uppercase', 'uppercase'],
    ],
    { value: 'uppercase' },
  ),
};

const members: Array<keyof typeof fileUploadStatusUptions> = [
  'fileUploadStatusFontType',
  'fileUploadStatusFontWeight',
  'fileUploadStatusTextTransform',
  'fileUploadStatusPendingFontColor',
  'fileUploadStatusUploadingColor',
  'fileUploadStatusFinishedColor',
  'fileUploadStatusProgressWidth',
  'fileUploadStatusProgressBackground',
];

export const fileUploadStatusCategory: OptionCategory = {
  label: 'File upload status',
  members,
};
