import inquirer from "inquirer";
import { version, getNewPackageVersion } from "./version.js";
import chalk from "chalk";

const prompts = [
  {
    type: "list",
    name: "version",
    message: "Select semver increment or specify new version",
    pageSize: version.length,
    choices: version.map((inc) => ({
      name: `${inc} 	${chalk.dim.cyan(getNewPackageVersion(inc))}`,
      value: inc,
    })),
  },
];

inquirer.prompt(prompts);