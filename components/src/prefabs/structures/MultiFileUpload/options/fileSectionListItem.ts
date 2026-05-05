import {
  buttongroup,
  color,
  font,
  icon,
  option,
  OptionCategory,
  showIf,
  sizes,
  ThemeColor,
  variable,
} from '@betty-blocks/component-sdk';

export const fileSectionListItemOptions = {
  fileSectionListItemInnerSpace: sizes('Inner spacing', {
    value: ['2rem', '2rem', '2rem', '2rem'],
  }),
  fileSectionListItemBorderSize: option('SIZE', {
    label: 'Border size',
    value: '1px',
    configuration: {
      as: 'UNIT',
    },
  }),
  fileSectionListItemBorderColor: color('Border color', {
    value: ThemeColor.MEDIUM,
  }),
  fileSectionListItemFontType: font('Text style', { value: ['Body1'] }),
  fileSectionListItemFontColor: color('Text color', {
    value: ThemeColor.BLACK,
    configuration: {
      hasThemeInherit: true,
    },
  }),
  fileSectionListItemFontWeight: option('CUSTOM', {
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
  fileSectionListItemUploadIconType: buttongroup(
    'File icon type',
    [
      ['Icon', 'icon'],
      ['SVG', 'svg'],
    ],
    {
      value: 'svg',
    },
  ),
  fileSectionListItemUploadIcon: icon('File icon', {
    configuration: {
      condition: showIf('fileSectionListItemUploadIconType', 'EQ', 'icon'),
    },
  }),
  fileSectionListItemUploadIconSvg: variable('File icon svg', {
    value: [
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M9 12.5h1v-2h1q.425 0 .713-.288T12 9.5v-1q0-.425-.288-.712T11 7.5H9zm1-3v-1h1v1zm3 3h2q.425 0 .713-.288T16 11.5v-3q0-.425-.288-.712T15 7.5h-2zm1-1v-3h1v3zm3 1h1v-2h1v-1h-1v-1h1v-1h-2zM8 18q-.825 0-1.412-.587T6 16V4q0-.825.588-1.412T8 2h12q.825 0 1.413.588T22 4v12q0 .825-.587 1.413T20 18zm-4 4q-.825 0-1.412-.587T2 20V6h2v14h14v2z" /></svg>`,
    ],
    configuration: {
      condition: showIf('fileSectionListItemUploadIconType', 'EQ', 'svg'),
    },
  }),
  fileSectionListItemUploadSuccessIconType: buttongroup(
    'File upload success icon type',
    [
      ['Icon', 'icon'],
      ['SVG', 'svg'],
    ],
    {
      value: 'svg',
    },
  ),
  fileSectionListItemUploadSuccessIcon: icon('File upload success icon', {
    configuration: {
      condition: showIf(
        'fileSectionListItemUploadSuccessIconType',
        'EQ',
        'icon',
      ),
    },
  }),
  fileSectionListItemUploadSuccessIconSvg: variable(
    'File upload success icon svg',
    {
      value: [
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#2e7d32" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m-2 15l-5-5l1.41-1.41L10 14.17l7.59-7.59L19 8z"/></svg>`,
      ],
      configuration: {
        condition: showIf(
          'fileSectionListItemUploadSuccessIconType',
          'EQ',
          'svg',
        ),
      },
    },
  ),
  fileSectionListItemUploadFailedIconType: buttongroup(
    'File upload failed icon type',
    [
      ['Icon', 'icon'],
      ['SVG', 'svg'],
    ],
    {
      value: 'svg',
    },
  ),
  fileSectionListItemUploadFailedIcon: icon('File upload failed icon', {
    configuration: {
      condition: showIf(
        'fileSectionListItemUploadFailedIconType',
        'EQ',
        'icon',
      ),
    },
  }),
  fileSectionListItemUploadFailedIconSvg: variable(
    'File upload failed icon svg',
    {
      value: [
        `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="#d32f2f" d="M2.93 17.07A10 10 0 1 1 17.07 2.93A10 10 0 0 1 2.93 17.07M9 5v6h2V5zm0 8v2h2v-2z"/></svg>`,
      ],
      configuration: {
        condition: showIf(
          'fileSectionListItemUploadFailedIconType',
          'EQ',
          'svg',
        ),
      },
    },
  ),
  fileSectionListItemRemoveIconType: buttongroup(
    'Remove file icon type',
    [
      ['Icon', 'icon'],
      ['SVG', 'svg'],
    ],
    {
      value: 'svg',
    },
  ),
  fileSectionListItemRemoveIcon: icon('Remove file icon', {
    configuration: {
      condition: showIf('fileSectionListItemRemoveIconType', 'EQ', 'icon'),
    },
  }),
  fileSectionListItemRemoveIconSvg: variable('Remove file icon svg', {
    value: [
      `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#d32f2f" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243"/></svg>`,
    ],
    configuration: {
      condition: showIf('fileSectionListItemRemoveIconType', 'EQ', 'svg'),
    },
  }),
};

const members = [
  'fileSectionListItemFontColor',
  'fileSectionListItemFontWeight',
  'fileSectionListItemFontType',
  'fileSectionListItemInnerSpace',
  'fileSectionListItemBorderSize',
  'fileSectionListItemBorderColor',
  'fileSectionListItemUploadIconType',
  'fileSectionListItemUploadIcon',
  'fileSectionListItemUploadIconSvg',
  'fileSectionListItemUploadSuccessIconType',
  'fileSectionListItemUploadSuccessIcon',
  'fileSectionListItemUploadSuccessIconSvg',
  'fileSectionListItemUploadFailedIconType',
  'fileSectionListItemUploadFailedIcon',
  'fileSectionListItemUploadFailedIconSvg',
  'fileSectionListItemRemoveIconType',
  'fileSectionListItemRemoveIcon',
  'fileSectionListItemRemoveIconSvg',
] satisfies Array<keyof typeof fileSectionListItemOptions>;

export const fileSeciontListItemCategory: OptionCategory = {
  label: 'Uploaded files',
  members,
};
