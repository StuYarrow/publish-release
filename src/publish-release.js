const core = require('@actions/core');
const { GitHub, context } = require('@actions/github');
const fs = require('fs');

async function run() {
  try {
    // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const github = new GitHub(process.env.GITHUB_TOKEN);

    // Get owner and repo from context of payload that triggered the action
    const { owner: currentOwner, repo: currentRepo } = context.repo;

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const release_id = core.getInput('id', { required: true });
    const owner = core.getInput('owner', { required: false }) || currentOwner;
    const repo = core.getInput('repo', { required: false }) || currentRepo;

    // Update a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#update-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/v16#repos-update-release
    const updateReleaseResponse = await github.repos.updateRelease({
      owner,
      repo,
      release_id,
      draft: false
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

module.exports = run;
