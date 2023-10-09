const core = require('@actions/core')
const { extract } = require('./extract')

const shell = require('shelljs')
const { query } = require('./query_ql')

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
    const outType = core.getInput('output-type') || 'md'

    // check outType
    if (!ValidOutputTypes.includes(outType)) {
      core.setFailed(
        `output-type ${outType} is not valid, must be one of ${ValidOutputTypes}`
      )
      return
    }

    core.info(`--> extracting pr changes for ${owner}/${repo}#${pr}`)
    core.info(`--> output type: ${outType}`)

    const fetchSh = fetchCommitsSh({ owner, repo, pr })

    const commitsOutput = shell.exec(fetchSh, {
      async: false
    })

    if (commitsOutput.stdout && !commitsOutput.stderr) {
      const { value, total, numOfMergedPR, numOfHotfix } = extract(
        JSON.parse(commitsOutput.stdout),
        outType
      )
      // set output summary
      // get github.event.pull_request.title
      const prTitle = core.getInput('pr-title')

      core.setOutput('value', value)
      core.setOutput('total', total)
      core.setOutput('numOfMerged', numOfMergedPR)
      core.setOutput('numOfHotfix', numOfHotfix)
      core.setOutput(
        'summary',
        `${prTitle} - What Changes:\n${total} Total; ${numOfMergedPR} Merged; ${numOfHotfix} Hotfix`
      )
    }
    if (commitsOutput.stderr) {
      core.error('---> error: ↓↓↓↓↓')
      core.error(commitsOutput.stderr)
    }
  } catch (err) {
    core.setFailed(err.message)
  }
}

const fetchCommitsSh = ({ owner, repo, pr }) =>
  `GH_CMD=$(which gh)
$GH_CMD api graphql \\
-f query='${query}' \\
-F owner='${owner}' \\
-F repo='${repo}' \\
-F pr='${pr}' \\
--paginate \\
--jq '.data.repository.pullRequest.commits.nodes | map(.commit) | map({oid, authoredDate, committedDate, messageBody, messageHeadline, authors: .authors.nodes | map({name, login: .user.login})})' | \\
jq -s 'flatten' | \\
jq '{ commits: .}' -r
`

module.exports = {
  run
}
