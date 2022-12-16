import shell from "shelljs";

export const getGitScript = (newVersion: string, branch: string) => [
  "git add ./package.json",
  `git commit -m "chore: update version to ${newVersion}"`,
  `git tag ${newVersion}`,
  `git push origin ${branch}`,
  `git push origin ${newVersion}`,
];

export const getGitBranchList = () => {
  const str = shell.exec("git branch", { silent: true }).stdout;
  const arr = str
    .split("\n")
    .filter(Boolean)
    .map((item) => item.trim());

  const curWithStar = arr.find((item) => item.startsWith("* ")) as string;

  const curBranch = curWithStar.slice(2);

  const branchList = [curBranch].concat(
    arr.filter((item) => !(item === curWithStar))
  );

  return { branchList, curBranch };
};
