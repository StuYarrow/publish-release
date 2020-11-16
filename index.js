const core = require('@actions/core');
const github = require('@actions/github');
const context = github.context;

async function main() {
  // Get authenticated GitHub client (Ocktokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
  const octokit = github.getOctokit(process.env.GITHUB_TOKEN);

  // Get owner and repo from context of payload that triggered the action
  const { owner: currentOwner, repo: currentRepo } = context.repo;

  // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
  const release_id = core.getInput('id', { required: true });
  const owner = core.getInput('owner', { required: false }) || currentOwner;
  const repo = core.getInput('repo', { required: false }) || currentRepo;

  // Update a release
  // API Documentation: https://developer.github.com/v3/repos/releases/#update-a-release
  // Octokit Documentation: https://octokit.github.io/rest.js/v16#repos-update-release
  await octokit.repos.updateRelease({
    owner,
    repo,
    release_id,
    draft: false
  });

  console.log(`Published release with id ${release_id}`)
}

async function run() {
  try {
    await main()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
