# what-changes actions

This action checks for changes between branches (PR), based on Merge Pull Request commit, and returns formatted output

# Usage

See [action.yml](action.yml)

### Example: Query changes between branches & post as comment

```yaml
on:
  pull_request:
    branches:
      - "releases/*" # or whatever ex: `main`
jobs:
  comment-pr-changes:
    name: Comment PR changes
    runs-on: ubuntu-latest
    steps:
      - uses: ClassFunc/what-changes@v3.2
        name: Get changes
        id: 'changes-table'
        with:
          output-type: 'md' # or 'html' or 'rows','json', default: 'md'

      - uses: mshick/add-pr-comment@v2
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

## Change Log

v3.2:

- Add `summary` output for short summary of changes

v3.1:

- Add `@` before logins for mention PR closed by authors

v3.0:

- Add 3 outputs: `total`, `numOfMerged`, `numOfHotfix`

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
