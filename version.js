import fs from "fs";
import path from "path";
import semver from "semver";

export const version = [
  "patch",
  "minor",
  "major",
  "prepatch",
  "preminor",
  "premajor",
  "prerelease",
];

export const getPackageJson = () => {
  return fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8");
};

export const getPackageVersion = () => {
  const packageJson = getPackageJson();
  return JSON.parse(packageJson).version;
};

// TODO gui to select version
export const writeNewVersion = (semverType, callback) => {
  const packageJson = getPackageJson();
  const projectVersion = getPackageVersion();

  const newVersion = semver.inc(projectVersion, semverType);

  const newPackageJson = packageJson.replace(
    `"version": "${projectVersion}"`,
    `"version": "${newVersion}"`
  );
  fs.writeFileSync(path.resolve(process.cwd(), "package.json"), newPackageJson);
  callback?.(newVersion);
};
