import {
  color,
  option,
  OptionCategory,
  ThemeColor,
  themeColor,
  toggle,
} from '@betty-blocks/component-sdk';

export const fileSectionOptions = {
  fileSectionBorderRadius: option('SIZE', {
    label: 'Border radius',
    value: '8px',
    configuration: {
      as: 'UNIT',
    },
  }),
  fileSectionBorderColor: color('Border color', {
    value: ThemeColor.LIGHT,
  }),
  fileSectionBorderSize: option('SIZE', {
    label: 'Border size',
    value: '8px',
    configuration: {
      as: 'UNIT',
    },
  }),
  fileSectionMaxHeight: option('SIZE', {
    label: 'Max height',
    value: '500px',
    configuration: {
      as: 'UNIT',
    },
  }),
  fileSectionBackground: color('Background color', {
    value: '#fff',
  }),
  fileSectionPreviewFiles: toggle('Preview uploaded files'),
};

const members: Array<keyof typeof fileSectionOptions> = [
  'fileSectionBorderRadius',
  'fileSectionBorderColor',
  'fileSectionBorderSize',
  'fileSectionMaxHeight',
  'fileSectionBackground',
  'fileSectionPreviewFiles',
];

export const fileSectionCategory: OptionCategory = {
  label: 'File list',
  members,
  expanded: false,
};
