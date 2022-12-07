import fs from "fs";
import path from "path";
import semver from "semver";

const getPackageJson = () => {
  return fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8");
};

const getPackageVersion = () => {
  const packageJson = getPackageJson();
  return JSON.parse(packageJson).version;
};

export const writeNewVersion = (type) => {
  const packageJson = getPackageJson();
  const projectVersion = getPackageVersion();
  
  const newVersion = semver.inc(projectVersion, type);

  const newPackageJson = packageJson.replace(
    `"version": "${projectVersion}"`,
    `"version": "${newVersion}"`
  );
  fs.writeFileSync(path.resolve(process.cwd(), "package.json"), newPackageJson);
};


writeNewVersion('patch');