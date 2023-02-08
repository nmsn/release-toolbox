import { Octokit } from '@octokit/core';
import fs from 'fs';
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

export const getGithubToken = () => {
  const configPath = path.join(process.cwd(), 'release-toolbox2.json');

  try {
    const { GITHUB_TOKEN } = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    if (!GITHUB_TOKEN) {
      throw new Error();
    }

    return GITHUB_TOKEN;
  } catch (err) {
    throw new Error('No valid "GITHUB_TOKEN" in release-toolbox.json, please add it.');
  }
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
  const GITHUB_TOKEN = getGithubToken();

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
