const core = require('@actions/core')
const { getExecOutput } = require('@actions/exec')
const { extract } = require('./extract')

/**
 * The main function for the action.
 * @returns {Promise<void>} Resolves when the action is complete.
 */

const ValidOutputTypes = ['md', 'markdown', 'html', 'rows', 'json']

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

    core.info(`--> extracting pr changes for ${owner}/${repo}#${pr}`)
    core.info(`--> output type: ${outType}`)

    const commitsOutput = await getExecOutput(
      'src/query_commits.sh',
      ['-q', query, '-o', owner, '-r', repo, '-p', pr],
      {
        silent: true
      }
    )

    if (commitsOutput.stdout && !commitsOutput.stderr) {
      const extracted = extract(JSON.parse(commitsOutput.stdout), outType)
      core.setOutput('value', extracted)
      core.info('outputs.value set to:')
      core.info(extracted)
    }
    if (commitsOutput.stderr) {
      core.error('---> error: ↓↓↓↓↓')
      core.error(commitsOutput.stderr)
    }
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
