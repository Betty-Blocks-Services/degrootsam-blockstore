import {
  buttongroup,
  color,
  font,
  icon,
  number,
  option,
  OptionCategory,
  showIf,
  size,
  sizes,
  ThemeColor,
  toggle,
  variable,
} from '@betty-blocks/component-sdk';

export const dragDropZoneOptions = {
  dragDropBorderRadius: option('SIZE', {
    label: 'Border radius',
    value: '8px',
    configuration: {
      as: 'UNIT',
    },
  }),
  dragDropTitleContent: variable('Title', {
    value: ['Drag & drop contracts here, or click to browser'],
    configuration: { as: 'MULTILINE', allowPropertyName: true },
  }),
  dragDropTitleContentExtra: variable("'Drop more files' title", {
    value: ['Drop more files here'],
    configuration: { as: 'MULTILINE', allowPropertyName: true },
  }),
  dragDropTitleType: font('Text style', { value: ['Title4'] }),
  dragDropTitleColor: color('Text color', {
    value: ThemeColor.INHERIT,
    configuration: {
      hasThemeInherit: true,
    },
  }),
  dragDropTitleFontWeight: option('CUSTOM', {
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
  dragDropSubtitleContent: variable('Subtitle', {
    value: ['Max 30MB per file · PDF Only · Multiple files supported'],
    configuration: { as: 'MULTILINE', allowPropertyName: true },
  }),
  dragDropSubtitleType: font('Text style', { value: ['Body2'] }),
  dragDropSubtitleColor: color('Text color', {
    value: ThemeColor.MEDIUM,
    configuration: {
      hasThemeInherit: true,
    },
  }),
  dragDropSubtitleFontWeight: option('CUSTOM', {
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
  dragDropUploadIconType: buttongroup(
    'Upload icon type',
    [
      ['Icon', 'icon'],
      ['SVG', 'svg'],
    ],
    { value: 'svg' },
  ),
  dragDropUploadIcon: icon('Upload icon', {
    configuration: {
      condition: showIf('dragDropUploadIconType', 'EQ', 'icon'),
    },
  }),
  dragDropUploadIconSvg: variable('Upload icon svg', {
    value: [
      `<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="M544 864V672h128L512 480L352 672h128v192H320v-1.6c-5.4.3-10.5 1.6-16 1.6A240 240 0 0 1 64 624a239 239 0 0 1 212.6-237.2A240 240 0 0 1 512 192a240 240 0 0 1 235.5 194.8A239 239 0 0 1 959.9 624a240 240 0 0 1-240 240c-5.3 0-10.5-1.3-16-1.6v1.6z"/></svg>`,
    ],
    configuration: {
      condition: showIf('dragDropUploadIconType', 'EQ', 'svg'),
    },
  }),
  dragDropUploadIconColor: color('Upload icon color', {
    value: '#08bed5',
  }),
  dragDropUploadIconSize: number('Upload icon size (px)', {
    value: 48,
  }),
  dragDropBorderSize: option('SIZE', {
    label: 'Border size',
    value: '2px',
    configuration: {
      as: 'UNIT',
    },
  }),
  dragDropBorderColor: color("'Inactive' border color", {
    value: '#ccc',
  }),
  dragDropBorderType: buttongroup(
    'Border type',
    [
      ['Solid', 'solid'],
      ['Dashed', 'dashed'],
    ],
    { value: 'dashed' },
  ),
  dragDropActiveBorderColor: color("'Active' border color", {
    value: '#0070f3',
  }),
  dragDropBackground: color('Background color', {
    value: 'transparent',
  }),
  dragDropActiveBackground: color("'Active' background color", {
    value: '#f0f7ff',
  }),
  dragDropPreviewActive: toggle('Preview active state'),
};

const members = [
  'dragDropUploadIconType',
  'dragDropUploadIcon',
  'dragDropUploadIconSvg',
  'dragDropUploadIconColor',
  'dragDropUploadIconSize',
  'dragDropBorderRadius',
  'dragDropTitleContent',
  'dragDropTitleContentExtra',
  'dragDropTitleColor',
  'dragDropTitleFontWeight',
  'dragDropTitleType',
  'dragDropSubtitleContent',
  'dragDropSubtitleType',
  'dragDropSubtitleColor',
  'dragDropSubtitleFontWeight',
  'dragDropBorderSize',
  'dragDropBorderType',
  'dragDropBorderColor',
  'dragDropActiveBorderColor',
  'dragDropBackground',
  'dragDropActiveBackground',
  'dragDropPreviewActive',
];

export const dragDropZoneCategory = {
  label: 'Drag & Drop zone',
  expanded: true,
  members,
};
