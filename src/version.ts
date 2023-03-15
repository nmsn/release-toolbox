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

/** eg: 1.0.0 -> 1.1.0 */
export const getNewPackageVersion = (input) => {
  if (version.includes(input)) {
    const projectVersion = getPackageVersion();
    return semver.inc(projectVersion, input);
  }

  return input;
};

// TODO gui to select version
export const writeNewVersion = (newVersion: string) => {
  const packageJson = getPackageJson();
  const projectVersion = getPackageVersion();

  const newPackageJson = packageJson.replace(
    `"version": "${projectVersion}"`,
    `"version": "${newVersion}"`
  );

  fs.writeFileSync(path.resolve(process.cwd(), 'package.json'), newPackageJson);
};

export const isValidVersionNumber = (input: string) => {
  return !!semver.valid(input);
};

export const isValidVersion = (input: string) => {
  return isValidVersionNumber(input) || version.includes(input);
};

export const isBeforeOrSameVersion = (newVersion: string, oldVersion: string) => {
  return semver.lte(newVersion, oldVersion);
};

export const isAfterVersion = (newVersion: string, oldVersion: string) => {
  return semver.gt(newVersion, oldVersion);
};
