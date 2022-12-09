import inquirer from "inquirer";
import { version, getNewPackageVersion } from "./version.js";
import { addDimSuffix, script } from "./utils.js";
import { getGitBranchList } from "./git.js";

const { branchList, curBranch } = getGitBranchList();

const prompts = [
  {
    type: "list",
    name: "version",
    message: "Select semver increment or specify new version",
    pageSize: version.length,
    choices: version.map((inc) => ({
      name: addDimSuffix(inc, getNewPackageVersion(inc)),
      value: inc,
    })),
  },
  {
    type: "list",
    name: "branch",
    message: "Select git local branch",
    pageSize: branchList.length,
    choices: branchList.map((inc) => ({
      name: inc === curBranch ? addDimSuffix(inc, "current") : inc,
      value: inc,
    })),
  },
];

export default async () => {
  const { version, branch } = await inquirer.prompt(prompts);
  script(version, branch);
};


// test