import { createConfig } from 'eslint';

const config = await createConfig();

/** @type {import("eslint").Linter.Config[]} */
export default [...config];
