import shell from "shelljs";

import { writeNewVersion } from "./version.js";
import { getGitScript } from "./git.js";
import { getNpmScript } from "./npm.js";

const execShell = async (scriptArr) => {
  for (let script of scriptArr) {
    try {
      await shell.exec(script);
    } catch (e) {
      console.error(e);
    }
  }
};

const script = (type, branch = "main") => {
  writeNewVersion(type, (version) => {
    const allScript = [...getGitScript({ version, branch }), ...getNpmScript()];

    execShell(allScript);
  });
};

export default script;
