import fs from "fs";
import path from "path";
import semver from "semver";
import shell from "shelljs";

const getPackageJson = () => {
  return fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8");
};

const getPackageVersion = () => {
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

const getGitScript = ({ version, branch }) => [
  "git add ./package.json",
  `git commit -m "chore: update version to ${version}"`,
  `git tag ${version}`,
  `git push origin ${branch}`,
];

// Just for no Two-Factor Authentication
const getNpmScript = () => ["npm publish"];

const execShell = async (scriptArr) => {
  for (let script of scriptArr) {
    try {
      await shell.exec(script);
    } catch (e) {
      console.error(e);
    }
  }
};

const script = (type, branch = "main") => {
  writeNewVersion(type, (version) => {
    const allScript = [...getGitScript({ version, branch }), ...getNpmScript()];

    execShell(allScript);
  });
};

export default script;
