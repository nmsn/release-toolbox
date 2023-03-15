import inquirer from 'inquirer';
import {
  version,
  getPackageVersion,
  getNewPackageVersion,
  isValidVersion,
  isBeforeOrSameVersion,
} from './version.js';
import { addDimSuffix, script, colorVersion } from './utils.js';
import { getGitBranchList } from './git.js';
import { getGithubToken } from './github.js';

const { branchList, curBranch } = getGitBranchList();

const curVersion = getPackageVersion();

enum TargetEnumType {
  NPM = 'npm',
  GITHUB = 'github',
}

export type AnswersType = {
  selectedVersion: string;
  inputVersion: string;
  branch: string;
  releaseBody: string;
  target: TargetEnumType[keyof TargetEnumType][];
};

const prompts = [
  {
    type: 'list',
    name: 'selectedVersion',
    message: 'Select semver increment or specify new version',
    pageSize: version.length + 3,
    choices: version
      .map((type) => ({
        name: addDimSuffix(type, getNewPackageVersion(type)),
        value: type,
      }))
      .concat([
        new inquirer.Separator() as any,
        {
          name: 'Other (specify)',
          value: undefined,
        },
        {
          name: `Just use current version: ${colorVersion(curVersion)}`,
          value: curVersion,
        },
      ]),
    filter: (input: string) => (isValidVersion(input) ? getNewPackageVersion(input) : undefined),
  },
  {
    type: 'input',
    name: 'inputVersion',
    message: 'Input version',
    when: (answers: AnswersType) => !answers.selectedVersion,
    filter: (input: string) => (isValidVersion(input) ? getNewPackageVersion(input) : undefined),
    validate: (input: string) => {
      if (!isValidVersion(input)) {
        return 'Please specify a valid semver, for example, `1.2.3`. See https://semver.org';
      }

      if (isBeforeOrSameVersion(input, curVersion)) {
        return `Version must be greater than ${curVersion}`;
      }

      return true;
    },
  },
  {
    type: 'list',
    name: 'branch',
    message: 'Select git local branch',
    pageSize: branchList.length,
    choices: branchList.map((inc) => ({
      name: inc === curBranch ? addDimSuffix(inc, 'current') : inc,
      value: inc,
    })),
  },
  {
    type: 'checkbox',
    name: 'target',
    message: 'Select target platform to push.',
    choices: ['npm', 'github'].map((item) => ({
      name: item,
      value: item,
    })),
    validate: (input: AnswersType['target']) => {
      if (input.includes('github') && !getGithubToken()) {
        return 'No valid "GITHUB_TOKEN" in release-toolbox.json, please add it.';
      }

      return true;
    },
  },
  {
    type: 'editor',
    name: 'releaseBody',
    when: (answers: AnswersType) => answers.target.includes('github'),
    message: 'Description of the release.',
  },
];

export default async () => {
  const { selectedVersion, branch, inputVersion, releaseBody, target } = await inquirer.prompt(
    prompts
  );
  const version = selectedVersion ?? inputVersion;
  script({ version, branch, releaseBody, target });
};
