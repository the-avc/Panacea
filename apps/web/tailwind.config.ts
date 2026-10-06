import type { Config } from 'tailwindcss';
import { default as panaceaPreset } from '../../packages/ui/src/tailwind-preset';

const config: Config = {
  presets: [panaceaPreset],
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    '../../packages/ui/src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
