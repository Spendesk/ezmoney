#!/usr/bin/env ts-node

import { resolve } from 'path';
import { exec } from 'child_process';
import {
  Extractor,
  IExtractorConfig,
  ExtractorValidationRulePolicy,
} from '@microsoft/api-extractor';

function resolveInRoot(...args: string[]): string {
  return resolve(__dirname, '..', ...args);
}

process.chdir(resolveInRoot('./.'));

const inCI = Boolean(process.env.CI);
const apiCheck = Boolean(process.argv.includes('--apicheck'));

async function execute(command: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(command, { cwd: resolveInRoot() }, (error, stdin, stdout) => {
      process.stdin.write(stdin);
      process.stdin.write(stdout);
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}

function generateApiFile(): void {
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
      enabled: false,
      tsdocMetadataPath: resolveInRoot('./tsdoc-metadata.json'),
    },
    apiJsonFile: {
      enabled: false,
    },
    dtsRollup: {
      enabled: false,
    },
    policies: {
      namespaceSupport: 'conservative',
    },
    validationRules: {
      missingReleaseTags: ExtractorValidationRulePolicy.error,
    },
  };

  const extractor: Extractor = new Extractor(config, {
    localBuild: !(apiCheck || inCI),
  });

  const success = extractor.processProject();
  if (!success) {
    console.error('Generation of API file ended with errors');
    process.exit(1);
  }
}

async function compile(): Promise<void> {
  try {
    await execute(
      `tsc --project ${resolveInRoot('./tsconfig.compilation.json')}`,
    );
  } catch (error) {
    console.error('Generation of JavaScript files ended with errors');
    process.exit(1);
  }
}

async function main(): Promise<void> {
  await compile();
  generateApiFile();
}

main();
