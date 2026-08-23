import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: [
      "src/components/model-showcases/deepseek-v4-flash/**/*.{ts,tsx}",
      "src/components/model-showcases/kimi-2.7-code/**/*.{ts,tsx}",
      "src/components/model-showcases/glm-5.2/**/*.{ts,tsx}",
    ],
    rules: {
      // ponytail: generated showcase outputs stay intact; typecheck still covers them.
      "react-hooks/preserve-manual-memoization": "off",
      "react-hooks/set-state-in-effect": "off",
      "react-hooks/static-components": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
