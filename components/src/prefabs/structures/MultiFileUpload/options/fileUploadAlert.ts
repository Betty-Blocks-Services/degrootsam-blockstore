import {
  color,
  buttongroup,
  number,
  OptionCategory,
  icon,
  showIf,
  variable,
} from '@betty-blocks/component-sdk';

export const fileUploadAlertOptions = {
  fileUploadAlertBackground: color('Background color', {
    value: '#FFF4E5',
  }),
  fileUploadAlertColor: color('Text color', {
    value: '#663D00',
  }),
  fileUploadAlertIconType: buttongroup(
    'Icon type',
    [
      ['Default', 'default'],
      ['SVG', 'svg'],
    ],
    {
      value: 'svg',
    },
  ),
  fileUploadAlertIcon: icon('Icon', {
    configuration: {
      condition: showIf('fileUploadAlertIconType', 'EQ', 'default'),
    },
  }),
  fileUploadAlertIconSVG: variable('Icon', {
    value: [
      '<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path fill="currentColor" d="M1 21L12 2l11 19zm3.45-2h15.1L12 6zm8.263-1.287Q13 17.425 13 17t-.288-.712T12 16t-.712.288T11 17t.288.713T12 18t.713-.288M11 15h2v-5h-2zm1-2.5" /></svg>',
    ],
    configuration: {
      condition: showIf('fileUploadAlertIconType', 'EQ', 'svg'),
    },
  }),
  fileUploadAlertIconColor: color('Icon Color', {
    value: '#ED6C02',
  }),
  fileUploadAlertIconSize: number('Icon size (px)', {
    value: 24,
  }),
};

const members = [
  'fileUploadAlertIconType',
  'fileUploadAlertIcon',
  'fileUploadAlertIconSVG',
  'fileUploadAlertBackground',
  'fileUploadAlertColor',
  'fileUploadAlertIconColor',
  'fileUploadAlertIconSize',
];

export const fileUploadAlertCategory = {
  label: 'File Upload Alert',
  members,
};
