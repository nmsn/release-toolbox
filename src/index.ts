import inquirer from "inquirer";
import {
  version,
  getPackageVersion,
  getNewPackageVersion,
  isValidVersion,
  isBeforeOrSameVersion,
} from "./version";
import { addDimSuffix, script } from "./utils";
import { getGitBranchList } from "./git";

const { branchList, curBranch } = getGitBranchList();

const curVersion = getPackageVersion();

type AnswersType = {
  selectedVersion: string;
  inputVersion: string;
  branch: string;
};

const prompts = [
  {
    type: "list",
    name: "selectedVersion",
    message: "Select semver increment or specify new version",
    pageSize: version.length + 2,
    choices: version
      .map((type) => ({
        name: addDimSuffix(type, getNewPackageVersion(type)),
        value: type,
      }))
      .concat([
        new inquirer.Separator() as any,
        {
          name: "Other (specify)",
          value: undefined,
        },
      ]),
    filter: (type: string) =>
      isValidVersion(type) ? getNewPackageVersion(type) : type,
  },
  {
    type: "input",
    name: "inputVersion",
    message: "Version",
    when: (answers: AnswersType) => !answers.selectedVersion,
    filter: (input: string) =>
      isValidVersion(input) ? getNewPackageVersion(input) : input,
    validate: (input: string) => {
      if (!isValidVersion(input)) {
        return "Please specify a valid semver, for example, `1.2.3`. See https://semver.org";
      }

      if (isBeforeOrSameVersion(input, curVersion)) {
        return `Version must be greater than ${curVersion}`;
      }

      return true;
    },
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
  const { selectedVersion, branch, inputVersion } = await inquirer.prompt(
    prompts
  );
  const version = selectedVersion ?? inputVersion;
  script(version, branch);
};
