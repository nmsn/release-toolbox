import shell from "shelljs";
import chalk from "chalk";

import { writeNewVersion } from "./version.js";
import { getGitScript } from "./git.js";
import { getNpmScript } from "./npm.js";

export const addDimSuffix = (base, suffix) => {
  return `${base} 	${chalk.dim.cyan(suffix)}`;
};

const execShell = async (scripts) => {
  for (let script of scripts) {
    try {
      await shell.exec(script);
    } catch (e) {
      console.error(e);
    }
  }
};

export const script = (type, branch = "main") => {
  writeNewVersion(type, (version) => {
    const allScript = [...getGitScript(version, branch), ...getNpmScript()];

    execShell(allScript);
  });
};
