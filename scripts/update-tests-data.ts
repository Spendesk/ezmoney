#!/usr/bin/env ts-node

import { resolve } from 'path';

function resolveInRoot(...args: string[]): string {
  return resolve(__dirname, '..', ...args);
}

process.chdir(resolveInRoot('./.'));

async function main(): Promise<void> {}

main();
