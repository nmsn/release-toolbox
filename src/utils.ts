import path from 'path';
import fs from 'fs';
import shell from 'shelljs';
import chalk from 'chalk';

import { writeNewVersion } from './version.js';
import { getGitScript } from './git.js';
import { getNpmScript } from './npm.js';

export const getPackageJson = () => {
  return fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8');
};

export const addDimSuffix = (base: string, suffix: string) => {
  return `${base} 	${chalk.dim.cyan(suffix)}`;
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

export const script = (newVersion: string, branch = 'main') => {
  writeNewVersion(newVersion, (version) => {
    const allScript = [...getGitScript(version, branch), ...getNpmScript()];

    execShell(allScript);
  });
};
