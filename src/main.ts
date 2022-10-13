import * as core from '@actions/core'
import * as github from '@actions/github'

async function run(): Promise<void> {
  try {
    // Get authenticated GitHub client (Octokit): https://github.com/actions/toolkit/tree/master/packages/github#usage
    const apiToken = process.env['GITHUB_TOKEN'] as string
    const octokit = github.getOctokit(apiToken)

    // Get owner and repo from context of payload that triggered the action
    const {owner: currentOwner, repo: currentRepo} = github.context.repo

    // Get the inputs from the workflow file: https://github.com/actions/toolkit/tree/master/packages/core#inputsoutputs
    const release_id = +core.getInput('id', {required: true})
    const owner = core.getInput('owner', {required: false}) || currentOwner
    const repo = core.getInput('repo', {required: false}) || currentRepo

    // Update a release
    // API Documentation: https://developer.github.com/v3/repos/releases/#update-a-release
    // Octokit Documentation: https://octokit.github.io/rest.js/v16#repos-update-release
    await octokit.rest.repos.updateRelease({
      owner,
      repo,
      release_id,
      draft: false
    })

    core.info(`Published release with id ${release_id}`)
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
