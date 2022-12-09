import inquirer from "inquirer";
import version from "./version";

const prompts = [
  {
    type: "list",
    name: "version",
    message: "Select semver increment or specify new version",
    pageSize: version.length,
    choices: version.map((inc) => ({
      name: `${inc} 	${prettyVersionDiff(oldVersion, inc)}`,
      value: inc,
    })),
  },
];

inquirer.prompt(prompts);
