const getGitScript = ({ version, branch }) => [
  "git add ./package.json",
  `git commit -m "chore: update version to ${version}"`,
  `git tag ${version}`,
  `git push origin ${branch}`,
];
