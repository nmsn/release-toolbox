import shell from "shelljs";
import chalk from "chalk";

import { writeNewVersion } from "./version";
import { getGitScript } from "./git";
import { getNpmScript } from "./npm";

export const addDimSuffix = (base: string, suffix: string) => {
  return `${base} 	${chalk.dim.cyan(suffix)}`;
};

const execShell = async (scripts: string[]) => {
  for (let script of scripts) {
    try {
      await shell.exec(script);
    } catch (e) {
      console.error(e);
    }
  }
};

export const script = (newVersion: string, branch = "main") => {
  writeNewVersion(newVersion, (version) => {
    const allScript = [...getGitScript(version, branch), ...getNpmScript()];

    execShell(allScript);
  });
};
