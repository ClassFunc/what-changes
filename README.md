# what-changes actions

This action checks for changes between branches (PR), based on Merge Pull Request commit, and returns formatted output

# Usage

See [action.yml](action.yml)

## Basic

```yaml
on:
  pull_request:
    branches:
      - "releases/*" # or whatever branch you want to check
steps:
  - uses: actions/checkout@v4
  - uses: ClassFunc/what-changes@v3.2
    id: 'changes-table'
    with:
      output-type: 'md' # or 'html' or 'rows','json', default: 'md'
  - name: Print Output
    id: output
    run: |-
      echo "Summary: ${{ steps.changes-table.outputs.summary }}"
      echo "Total: ${{ steps.changes-table.outputs.total }}"
      echo "${{ steps.changes-table.outputs.numOfMerged }} Merged"
      echo "${{ steps.changes-table.outputs.numOfHotfix }} Hotfix"
      echo "${{ steps.changes-table.outputs.value }}"
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
