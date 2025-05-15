import { execSync } from "child_process";
import { existsSync, mkdtempSync } from "fs";
import { join } from "path";
import { tmpdir } from "os";
import fs from "fs";

const SOURCE_PATH = process.argv[2]; // path to local git repo
const REPO_PREFIX = "repo-prefix"; // base name for new repos
const TARGET_OWNER = "target-owner-or-org"; // GitHub user or org
const NUM_COPIES = 5; // number of GitHub repos to create

if (!SOURCE_PATH || !existsSync(SOURCE_PATH)) {
    console.error("❌ Please provide a valid path to a git project.");
    process.exit(1);
}

function run(cmd, options = {}) {
    return execSync(cmd, { stdio: "inherit", ...options });
}

function deleteFolder(folderPath) {
    if (fs.existsSync(folderPath)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`🧹 Deleted temp folder: ${folderPath}`);
    }
}

function deleteGitHubRepo(fullRepoName) {
    try {
        console.warn(`🗑️ Deleting GitHub repo: ${fullRepoName}`);
        run(`gh repo delete ${fullRepoName} --yes`);
    } catch (e) {
        console.error(`❌ Failed to delete GitHub repo: ${fullRepoName}`);
    }
}

for (let i = 1; i <= NUM_COPIES; i++) {
    const repoName = `${REPO_PREFIX}-${i}`;
    const fullRepoName = `${TARGET_OWNER}/${repoName}`;
    const tempDir = mkdtempSync(join(tmpdir(), `${repoName}-`));

    console.log(`📁 Copying project to temp dir: ${tempDir}`);
    run(`cp -r ${SOURCE_PATH}/* ${tempDir}`);
    run(`cp -r ${SOURCE_PATH}/.git ${tempDir}`);

    try {
        console.log(`📦 Creating repo on GitHub: ${repoName}`);
        run(`gh repo create ${fullRepoName} --public --confirm`, {
            cwd: tempDir,
        });

        const httpsUrl = `https://github.com/${fullRepoName}.git`;

        console.log(`🔗 Setting remote origin to HTTPS: ${httpsUrl}`);
        try {
            run(`git remote set-url origin ${httpsUrl}`, { cwd: tempDir });
        } catch {
            run(`git remote add origin ${httpsUrl}`, { cwd: tempDir });
        }

        run(`git branch -M main`, { cwd: tempDir });

        try {
            console.log(`🚀 Pushing to GitHub repo: ${repoName}`);
            run(`git push -u origin main`, { cwd: tempDir });
        } catch (e) {
            throw e;
        }
    } catch (e) {
        deleteGitHubRepo(fullRepoName);
        deleteFolder(tempDir);
    }
}