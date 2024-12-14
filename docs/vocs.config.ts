import { defineConfig } from 'vocs'

export default defineConfig({
  title: 'Stage.js',
  rootDir: '.',
  basePath: "/stage.js/docs/",
  baseUrl: "/stage.js/docs/",
  topNav: [ 
    { text: 'API Reference', link: '/api/'},
    { text: 'GitHub', link: 'https://github.com/piqnt/stage.js/'},
    { text: 'Discord', link: 'https://discord.gg/7B5e7MXFxQ'},
  ],
  sidebar: [
    {
      text: 'Getting Started',
      collapsed: false,
      items: [
        {
          text: 'Introduction',
          link: '/',
        },
        {
          text: 'Install',
          link: '/install',
        },
        {
          text: 'Hello World',
          link: '/hello-world',
        },
      ],
    },
    {
      text: 'Core',
      collapsed: false,
      items: [
        {
          text: 'Setup',
          link: '/setup',
        },
        {
          text: 'Game Loop',
          link: '/loop',
        },
        {
          text: 'Events and Pointer',
          link: '/events',
        },
      ],
    },
    {
      text: 'Texture',
      collapsed: false,
      items: [
        {
          text: 'Texture',
          link: '/texture',
        },
        {
          text: 'Atlas',
          link: '/atlas',
        },
        {
          text: 'Sprite Component',
          link: '/sprite',
        },
        {
          text: 'Anim Component',
          link: '/anim',
        },
        {
          text: 'Monotype Component',
          link: '/monotype',
        },
      ],
    },
    {
      text: 'Layout',
      collapsed: false,
      items: [
        {
          text: 'Component Tree',
          link: '/tree',
        },
        {
          text: 'Pin',
          link: '/pin',
        },
        {
          text: 'Transition',
          link: '/transition',
        },
        {
          text: 'Layout Components',
          link: '/layout',
        },
      ],
    },
    {
      text: 'API Reference',
      link: '/api/',
    },
    {
      text: 'What\'s new?',
      collapsed: false,
      items: [
        {
          text: 'V1.0 - Work in Progress',
          link: '/news/v1-0',
        },
      ],
    },
  ],
})
