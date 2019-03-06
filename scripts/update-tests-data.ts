#!/usr/bin/env ts-node

import { resolve } from 'path';
import * as fs from 'fs-extra';
import { buildCallsMap as buildNumberToLocaleStringCallsData } from '../src/__tests__/utils/number-tolocalestring-memo';

function resolveInRoot(...args: string[]): string {
  return resolve(__dirname, '..', ...args);
}

process.chdir(resolveInRoot('./.'));

async function updateNumberToLocaleStringCallsData(): Promise<void> {
  await fs.writeFile(
    resolveInRoot('./src/__tests__/data/number-tolocalestring-calls.json'),
    JSON.stringify(buildNumberToLocaleStringCallsData(), null, 2),
  );
}

async function main(): Promise<void> {
  try {
    await updateNumberToLocaleStringCallsData();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main();
