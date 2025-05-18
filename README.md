# Repo Copier

## What is this?
This script helps you automate the creation of multiple copies of a GitHub repository — ideal for testing different configurations on the same base repo without manually duplicating via the GitHub UI.

## Why Use This?
Cloning a sample repo multiple times through GitHub's web interface is repetitive and time-consuming.
This script reduces that effort by ~95%, letting you create many repositories in seconds.

## How to Use?

Make sure [gh CLI]([url](https://cli.github.com/manual/)) is installed and you're logged in:

```bash
gh auth login
```

Set up the script

Copy `index.js` to your local machine

Open it and replace the variables for repoName for the target github repo, number of copies, etc...

To run execute this command:

```js
node index.js <path-to-original-repo>
```

Note: Mae sure the original repo is git initialized.

!! Happy Coding !!

