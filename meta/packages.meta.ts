import { PackageManifest } from './types.meta';

export const packages: PackageManifest[] = [
  {
    name: 'shared',
    display: 'Shared utilities',
  },

  {
    name: 'core',
    display: 'VueUse',
    description: 'Collection of essential Vue Composition Utilities',
  },

  {
    name: 'components',
    display: 'Components',
    description: 'Renderless components for VueUse',
    author: 'Jacob Clevenger<https://github.com/wheatjs>',
    external: ['@vueuse/core', '@vueuse/shared'],
  },

  {
    name: 'router',
    display: 'Router',
    description: 'Utilities for vue-router',
    addon: true,
    external: ['vue-router'],
    globals: {
      'vue-router': 'VueRouter',
    },
  },

  {
    name: 'integrations',
    display: 'Integrations',
    description: 'Integration wrappers for utility libraries',
    addon: true,
    submodules: true,
    external: [
      'universal-cookie',
      'qrcode',
      'http',
      'nprogress',
      'jwt-decode',
      'focus-trap',
      '@vueuse/core',
      '@vueuse/shared',
      'fuse.js',
    ],
    globals: {
      'universal-cookie': 'UniversalCookie',
      'qrcode': 'QRCode',
      'nprogress': 'nprogress',
      'jwt-decode': 'jwt_decode',
      'focus-trap': 'focusTrap',
      'fuse.js': 'Fuse',
    },
  },
];
