import { prefab, Icon } from '@betty-blocks/component-sdk';

import { MultiFileUpload } from './structures/MultiFileUpload';

const attributes = {
  category: 'CONTENT',
  icon: Icon.TitleIcon,
  keywords: [''],
};

export default prefab('MultiFileUpload', attributes, undefined, [
  MultiFileUpload({}),
]);
