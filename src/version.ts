import fs from 'fs';
import path from 'path';
import semver from 'semver';
import { getPackageJson } from './utils.js';

export const version = [
  'patch',
  'minor',
  'major',
  'prepatch',
  'preminor',
  'premajor',
  'prerelease',
];

export const getPackageVersion = () => {
  const packageJson = getPackageJson();
  return JSON.parse(packageJson).version;
};

export const getNewPackageVersion = (input) => {
  validate(input);
  if (version.includes(input)) {
    const projectVersion = getPackageVersion();
    return semver.inc(projectVersion, input);
  }

  return input;
};

// TODO gui to select version
export const writeNewVersion = (newVersion: string, callback?: (newVersion: string) => void) => {
  const packageJson = getPackageJson();
  const projectVersion = getPackageVersion();

  const newPackageJson = packageJson.replace(
    `"version": "${projectVersion}"`,
    `"version": "${newVersion}"`
  );

  fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), newPackageJson);
  callback?.(newVersion);
};

export const isValidVersion = (input: string) => {
  return !!semver.valid(input) || version.includes(input);
};

const validate = (input: string) => {
  if (!isValidVersion(input)) {
    throw new Error('Version should be a valid semver version.');
  }
};

export const isBeforeOrSameVersion = (newVersion: string, oldVersion: string) => {
  return semver.lte(newVersion, oldVersion);
};
