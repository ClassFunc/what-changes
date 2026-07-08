# what-changes actions

This action checks for changes between branches (PR), based on Merge Pull Request commits and hotfixes, and returns formatted outputs (Markdown, HTML, JSON, or raw rows).

[![Continuous Integration](https://github.com/ClassFunc/what-changes/actions/workflows/ci.yml/badge.svg)](https://github.com/ClassFunc/what-changes/actions/workflows/ci.yml)
[![Coverage](./badges/coverage.svg)](./badges/coverage.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## Inputs

| Input | Description | Required | Default |
| :--- | :--- | :---: | :--- |
| `owner` | The owner/organization of the repository. | No | `${{ github.event.repository.owner.login }}` |
| `repo` | The name of the repository. | No | `${{ github.event.repository.name }}` |
| `pr` | The pull request number. | No | `${{ github.event.number }}` |
| `output-type` | The format of the output changes. Allowed values: `md`, `markdown`, `html`, `rows`, `json`. | No | `md` |
| `pr-title` | The pull request title, used in the `summary` output. | No | `${{ github.event.pull_request.title }}` |

## Outputs

| Output | Description |
| :--- | :--- |
| `value` | The formatted change details matching the requested `output-type`. |
| `total` | The total number of changes (Merged PRs + Hotfixes) found. |
| `numOfMerged` | The number of merged pull requests. |
| `numOfHotfix` | The number of hotfix commits. |
| `summary` | A short text summary of the changes, prefixing the PR title. |

---

## Usage

See [action.yml](action.yml)

### Example: Query changes between branches & post as comment

This example fetches changes for the current pull request and adds a comment containing the change details.

```yaml
on:
  pull_request:
    branches:
      - "releases/*" # or whatever ex: `main`

jobs:
  comment-pr-changes:
    name: Comment PR changes
    runs-on: ubuntu-latest
    permissions:
      pull-requests: write # required to post comments on PRs
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Get changes
        id: changes-table
        uses: ClassFunc/what-changes@v3.3
        with:
          output-type: 'md' # or 'html' or 'rows','json', default: 'md'

      - name: Add PR comment
        uses: mshick/add-pr-comment@v3
        name: Add PR comment
        with:
          message-id: 'whatchanges'
          message: |
            ${{ steps.changes-table.outputs.summary }}
            Total: ${{ steps.changes-table.outputs.total }}
            ${{ steps.changes-table.outputs.numOfMerged }} Merged
            ${{ steps.changes-table.outputs.numOfHotfix }} Hotfix
            
            ${{ steps.changes-table.outputs.value }}
          repo-token: ${{ secrets.GITHUB_TOKEN }}
```

---

## Change Log

### v3.3
- Upgraded runner environment to Node 20.
- Upgraded package dependencies.
- Migrated linter to ESLint Flat Config.

### v3.2
- Added `summary` output for short summary of changes.

### v3.1
- Added `@` before logins for mention PR closed by authors.

### v3.0
- Added 3 outputs: `total`, `numOfMerged`, and `numOfHotfix`.

---

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE).
