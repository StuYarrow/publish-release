# Publish an existing draft release
This GitHub Action (written in JavaScript) uses the [GitHub Release API](https://developer.github.com/v3/repos/releases/), specifically the [Update a Release](https://developer.github.com/v3/repos/releases/#update-a-release) endpoint, to set `draft=false` on an existing release.

This action is similar to [@`eregon/publish-release`](https://www.github.com/eregon/publish-release), but additionally has support for releases on repos other than the one from which it is run.

## Usage
### Pre-requisites
Create a workflow `.yml` file in your `.github/workflows` directory. An [example workflow](#example-workflow---create-a-release) is available below. For more information, reference the GitHub Help Documentation for [Creating a workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file).

### Inputs
For more information on these inputs, see the [API Documentation](https://developer.github.com/v3/repos/releases/#input)

- `id`: The release id, e.g. from the `id` output of the [`@actions/create-release`](https://www.github.com/actions/create-release) GitHub Action.
- `owner`: The name of the owner of the repo. Used to identify the owner of the repository.  Used when cutting releases for external repositories.  Default: Current owner
- `repo`: The name of the repository. Used to identify the repository on which to release.  Used when cutting releases for external repositories. Default: Current repository

The `GITHUB_TOKEN` environment variable must be set to an appropriate access token.  If publishing on the same repo that runs the workflow, the automatically created token `${{ secrets.GITHUB_TOKEN }}` should work.  If the release is on a different repo, you need to create a personal access token with write privileges on the target repo and store it as a secret.

### Example workflow

* Create a draft release
* Upload an attachment
* Publish the draft release

On every `push` to a tag matching the pattern `v*`, [create a release](https://developer.github.com/v3/repos/releases/#create-a-release):

```yaml
on:
  push:
    # Sequence of patterns matched against refs/tags
    tags:
      - 'v*' # Push events to matching v*, i.e. v1.0, v20.15.10

name: Create Release

jobs:
  build:
    name: Create Release
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Create release
        id: create_release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # This token is provided by Actions, you do not need to create your own token
        with:
          tag_name: ${{ github.ref }}
          release_name: Release ${{ github.ref }}
          body: |
            Changes in this Release
            - First Change
            - Second Change
          draft: true
          prerelease: false
      - name: Upload release asset
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create_release.outputs.upload_url }}
          asset_path: ./path/to/asset.zip
          asset_name: asset.zip
          asset_content_type: application/zip
      - name: Publish release
        uses: StuYarrow/publish-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          id: ${{ steps.create_release.outputs.id }}
```

## License
The scripts and documentation in this project are released under the [MIT License](LICENSE)
