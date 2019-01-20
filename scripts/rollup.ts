#!/usr/bin/env ts-node

import { resolve } from 'path';
import { readFileSync } from 'fs';
import { pascalCase } from 'change-case';
import typescript from 'typescript';
import * as rollup from 'rollup';
import rollupTypescript from 'rollup-plugin-typescript2';
import {
  Extractor,
  IExtractorConfig,
  ExtractorValidationRulePolicy,
} from '@microsoft/api-extractor';

function resolveInRoot(...args: string[]): string {
  return resolve(__dirname, '..', ...args);
}

process.chdir(resolveInRoot('./.'));

interface PackageJson {
  name: string;
  main?: string;
  module?: string;
  typings?: string;
  dependencies: { [name: string]: string };
  peerDependencies: { [name: string]: string };
}

interface BuildOptions {
  external?: string[];
  name?: string;
}

async function rollupCode(
  packageJson: PackageJson,
  options: BuildOptions = {},
): Promise<void> {
  const {
    external = [],
    name = pascalCase(packageJson.name.replace(/@/g, '').replace(/\//g, '_')),
  } = options;

  const config = {
    input: resolveInRoot('./src/index.ts'),
    external: [
      ...Object.keys(packageJson.dependencies || {}),
      ...Object.keys(packageJson.peerDependencies || {}),
      ...external,
    ],
    plugins: [
      rollupTypescript({
        typescript,
        cacheRoot: resolveInRoot('./.temp/rpt2_cache'),
        tsconfig: resolveInRoot('./tsconfig.json'),
      }),
    ],
  };
  const bundle = await rollup.rollup(config);

  await Promise.all([
    bundle.write({
      file: resolveInRoot(packageJson.main || './index.js'),
      format: 'umd',
      name,
      globals: {
        path: 'path',
        typescript: 'ts',
      },
    }),
    bundle.write({
      file: resolveInRoot(packageJson.module || './index.mjs'),
      format: 'esm',
    }),
  ]);
}

async function rollupDeclarations(packageJson: PackageJson): Promise<void> {
  // TODO: Check that compilation happened first

  const config: IExtractorConfig = {
    compiler: {
      configType: 'tsconfig',
      rootFolder: resolveInRoot('.'),
    },
    project: {
      entryPointSourceFile: resolveInRoot('./lib/index.d.ts'),
    },
    apiReviewFile: {
      enabled: true,
      apiReviewFolder: resolveInRoot('./.'),
      tempFolder: resolveInRoot('./.temp'),
    },
    tsdocMetadata: {
      enabled: true,
    },
    apiJsonFile: {
      enabled: false,
    },
    dtsRollup: {
      enabled: true,
      publishFolder: resolveInRoot('.'),
      mainDtsRollupPath: packageJson.typings || './index.d.ts',
    },
    policies: {
      namespaceSupport: 'conservative',
    },
    validationRules: {
      missingReleaseTags: ExtractorValidationRulePolicy.error,
    },
  };

  const extractor: Extractor = new Extractor(config, {
    localBuild: false,
  });

  const success = extractor.processProject();
  if (!success) {
    console.error('Rollup of declarations ended with warnings or errors');
    process.exit(1);
  }
}

async function main(packageJson: PackageJson): Promise<void> {
  await rollupDeclarations(packageJson);
  await rollupCode(packageJson, { external: ['path'], name: 'Ezmoney' });
}

main(
  JSON.parse(
    readFileSync(resolveInRoot('./package.json'), { encoding: 'utf8' }),
  ),
);
