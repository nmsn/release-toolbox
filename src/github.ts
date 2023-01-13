import { Octokit } from '@octokit/core';
// import fs from 'fs';
import path from 'path';
import { getPackageJson } from './utils.js';

const getInfoFromGithubBaseUrl = (url: string) => {
  const result = url.split('/');
  return result;
};

const getCurrentPackageGithubInfo = () => {
  const packageJson = getPackageJson();
  const { url } = JSON.parse(packageJson).repository;
  const [owner, fullRepo] = getInfoFromGithubBaseUrl(url).slice(-2);
  const repo = fullRepo.split('.')[0];
  return [owner, repo];
};

// const hasConfigCurrentDirectory = async (filePath: string) =>
//   await fs.promises
//     .access(filePath)
//     .then(() => true)
//     .catch(() => false);

const getGithubToken = async () => {
  const configPath = path.join(process.cwd(), 'release-toolbox.json');

  // TODO check
  // const hasConfig = await hasConfigCurrentDirectory(configPath);

  const { GITHUB_TOKEN } = await import(configPath);
  return GITHUB_TOKEN;
};

// https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#create-a-release--code-samples
type GithubReleaseType = {
  owner: string;
  repo: string;
  tag_name: string;
  /** branch or SHA */
  target_commitish?: string;
  name?: string;
  body?: string;
  /** true to create a draft(unpublished) release */
  draft?: boolean;
  prerelease?: boolean;
  discussion_category_name?: string;
  generate_release_notes?: string;
  make_latest?: string;
};

const octokitRelease = async ({
  owner,
  repo,
  tag_name,
  name = tag_name,
  body,
}: GithubReleaseType) => {
  const GITHUB_TOKEN = await getGithubToken();

  const octokit = new Octokit({
    auth: GITHUB_TOKEN,
  });

  await octokit.request('POST /repos/{owner}/{repo}/releases', {
    owner,
    repo,
    tag_name,
    name,
    body,
  });
};

export const githubRelease = (newVersion: string, body?: string) => {
  const [owner, repo] = getCurrentPackageGithubInfo();
  octokitRelease({
    owner: owner,
    repo,
    tag_name: newVersion,
    body,
  });
};
