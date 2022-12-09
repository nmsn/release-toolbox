import shell from "shelljs";

import { writeNewVersion } from "./version";
import { getGitScript } from "./git";
import { getNpmScript } from "./npm";

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
