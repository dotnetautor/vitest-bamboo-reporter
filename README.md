# Installation
Install the package `vitest-bamboo-reporter` as development dependency. Furthermore `vitest` is required as peer dependency.

```sh
# pnpm 
pnpm install -D vitest-bamboo-reporter
# yarn
yarn add --dev vitest-bamboo-reporter
# npm
npm install -D dev vitest-bamboo-reporter
```

# Usage
## Basic usage
Add new custom reporter and define outputFile in your `vite.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: 'vitest-bamboo-reporter',
    outputFile: 'bamboo-report.json',
  },
});  
```

This plugin can also be combined with other reporters. In this case the option `outputFile` will become an object where the key for the output filename of this plugin is `vitest-bamboo-reporter`.   

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: ['verbose', 'vitest-bamboo-reporter'],
    outputFile: {
      'vitest-bamboo-reporter': 'bamboo-report.json',
    },
  },
});
``` 

Please refer: [https://vitest.dev/config/#reporters](https://vitest.dev/config/#reporters)

# Build
```sh
git clone 
cd vitest-bamboo-reporter
pnpm install
pnpm build
```
