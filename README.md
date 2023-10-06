# what-changes actions

This action checks for changes of between 2 prs, based on Merge Pull Request commit, and returns formatted output

# Usage

See [action.yml](action.yml)

## Basic

```yaml
on:
  pull_request:
    branches:
      - "release/*" # or whatever branch you want to check
steps:
  - uses: actions/checkout@v4
  - uses: ClassFunc/what-changes@v3.1
    id: 'changes-table'
    with:
      output-type: 'md' # or 'html' or 'rows','json', default: 'md'
  - name: Print Output
    id: output
    run: |
      echo "Total: ${{ steps.changes-table.outputs.total }}"
      echo "${{ steps.changes-table.outputs.numOfMerged }} Merged"
      echo "${{ steps.changes-table.outputs.numOfHotfix }} Hotfix"
      echo "Details: \n\n"
      echo "${{ steps.changes-table.outputs.value }}"
```

## Change Log

v3.1:

- Add `@` before logins for mention github users

v3.0:

- Add 3 outputs: `total`, `numOfMerged`, `numOfHotfix`

# License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
