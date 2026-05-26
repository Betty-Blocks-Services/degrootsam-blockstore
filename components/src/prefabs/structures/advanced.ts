import { variable } from '@betty-blocks/component-sdk';

export const advanced = (value) => ({
  dataComponentAttribute: variable('Test attribute', {
    value: [value],
  }),
});
