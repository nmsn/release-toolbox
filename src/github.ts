import { Octokit } from '@octokit/core';
import fs from 'fs';

const json = fs.readFileSync('./release-toolbox.json');

// TODO Determine whether the parameter exists
const { GITHUB_TOKEN } = JSON.parse(json.toString());

// https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28#create-a-release--code-samples
type GithubReleaseType = {
  owner: string;
  repo: string;
  tag_name: string;
  target_commitish?: string;
  name?: string;
  body?: string;
  draft?: boolean;
  prerelease?: boolean;
  discussion_category_name?: string;
  generate_release_notes?: string;
  make_latest?: string;
};

export const githubRelease = async ({
  owner,
  repo,
  tag_name,
  name = tag_name,
  body,
}: GithubReleaseType) => {
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
