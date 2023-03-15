import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';
import type { AnswersType } from './index.js';
import { writeNewVersion, isAfterVersion, getPackageVersion } from './version.js';
import { getGitScript } from './git.js';
import { getNpmScript } from './npm.js';
import { githubRelease } from './github.js';

export const getPackageJson = () => {
  return fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8');
};

export const colorVersion = (version: string) => {
  return chalk.dim.cyan(version);
};

export const addDimSuffix = (base: string, suffix: string) => {
  return `${base} 	${colorVersion(suffix)}`;
};

const execShell = async (scripts: string[]) => {
  for (const script of scripts) {
    try {
      await shell.exec(script);
    } catch (e) {
      console.error(e);
    }
  }
};

export const script = async ({
  version,
  branch = 'main',
  releaseBody,
  target,
}: Omit<AnswersType, 'selectedVersion' | 'inputVersion'> & {
  version: AnswersType['selectedVersion'] | string;
}) => {
  const curVersion = getPackageVersion();

  if (isAfterVersion(version, curVersion)) {
    writeNewVersion(version);
    execShell(getGitScript(version, branch));
  }

  target.includes('npm') && execShell(getNpmScript());
  target.includes('github') && githubRelease(version, releaseBody);
};
