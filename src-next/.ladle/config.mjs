/** @type {import('@ladle/react').UserConfig} */
export default {
  stories: ['src/stories/**/*.stories.{tsx,mdx}'],
  outDir: 'dist-ladle',
  addons: {
    a11y: { enabled: true },
    action: { enabled: true, defaultState: 'hidden' },
    control: { enabled: true, defaultState: 'visible' },
    ladle: { enabled: true },
    mode: { enabled: true, defaultState: 'full' },
    rtl: { enabled: false },
    theme: { enabled: true, defaultState: 'light' },
    width: { enabled: true, defaultState: 0 },
  },
}
