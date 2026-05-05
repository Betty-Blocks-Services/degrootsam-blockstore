import { model, number, option, property } from '@betty-blocks/component-sdk';
import { advanced } from 'src/prefabs/structures/advanced';
import { getAllowedKindsByType } from 'src/utils/allowedKinds';
import { dragDropZoneCategory, dragDropZoneOptions } from './dragDropZone';
import { fileSectionCategory, fileSectionOptions } from './fileSection';
import {
  fileSeciontListItemCategory,
  fileSectionListItemOptions,
} from './fileSectionListItem';
import {
  fileSectionTitleCategory,
  fileSectionTitleOptions,
} from './fileSectionTitle';
import {
  fileUploadStatusCategory,
  fileUploadStatusUptions,
} from './fileUploadStatus';
import { rootCategory, rootOptions } from './root';

export const categories = [
  rootCategory,
  dragDropZoneCategory,
  fileSectionTitleCategory,
  fileSectionCategory,
  fileSeciontListItemCategory,
  fileUploadStatusCategory,
  {
    label: 'Advanced Options',
    expanded: false,
    members: ['dataComponentAttribute'],
  },
];

const { allowedKinds, allowedInputKinds } = getAllowedKindsByType('file');

export const multiFileUploadOptions = {
  actionId: option('ACTION_JS_VARIABLE', {
    label: 'Action input variable',
    value: '',
    configuration: {
      ...(allowedInputKinds ? { allowedKinds: allowedInputKinds } : undefined),
    },
  }),
  model: model('Model'),
  property: property('File property', {
    configuration: {
      dependsOn: 'model',
    },
  }),
  maxFileSize: number('Max File size (MB)', {
    value: 10,
  }),
  ...rootOptions,
  ...dragDropZoneOptions,
  ...fileSectionTitleOptions,
  ...fileSectionOptions,
  ...fileSectionListItemOptions,
  ...fileUploadStatusUptions,
  ...advanced('MultiFileUpload'),
};
