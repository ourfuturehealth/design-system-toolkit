import { execSync } from 'node:child_process';

const themes = ['participant', 'research'];

for (const theme of themes) {
  execSync('vite build', {
    stdio: 'inherit',
    env: {
      ...process.env,
      OFH_THEME_MODE: theme,
    },
  });
}
