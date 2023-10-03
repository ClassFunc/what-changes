const core = require('@actions/core')
const { getExecOutput } = require('@actions/exec')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

const ValidOutputTypes = ['md', 'html', 'rows']

async function run() {
  try {
    const owner = core.getInput('owner')
    const repo = core.getInput('repo')
    const pr = core.getInput('pr')
    const outType = core.getInput('output-type')

    // check outType
    if (!ValidOutputTypes.includes(outType)) {
      core.setFailed(
        `output-type ${outType} is not valid, must be one of ${ValidOutputTypes}`
      )
      return
    }

    console.log(`--> extracting pr changes for ${owner}/${repo}#${pr}`)
    console.log(`--> output type: ${outType}`)

    const execOutput = await getExecOutput(
      'dist/bash.sh',
      ['-q', query, '-o', owner, '-r', repo, '-p', pr, '-t', outType],
      {
        silent: true
      }
    )
    console.log('---> output:', execOutput.stdout)
    console.log('---> err:', execOutput.stderr)
    //   set output
    core.setOutput('value', execOutput.stdout)
  } catch (err) {
    core.setFailed(err.message)
  }
}

const query =
  `query ($owner: String!, $repo: String!, $pr: Int!, $endCursor: String) {
    repository(owner: $owner, name: $repo) {
        pullRequest(number: $pr) {
            commits(first: 100, after: $endCursor) {
                totalCount
                pageInfo {
                    startCursor
                    endCursor
                    hasNextPage
                    hasPreviousPage
                }
                nodes {
                    commit {
                        authoredDate
                        authors(last: 2) {
                            nodes {
                                name
                                user {
                                    login
                                }
                            }
                        }
                        committedDate
                        messageBody
                        messageHeadline
                        oid
                    }
                }
            }
        }
    }
}`.replace(/\s+/g, ' ') // replace all multi spaces with single space

module.exports = {
  run
}
