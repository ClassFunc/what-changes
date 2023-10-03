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

    console.log(`extracting pr changes for ${owner}/${repo}#${pr}`)
    console.log(`output type: ${outType}`)
    const bash = bashScript({ owner, repo, pr, outType })
    const execOutput = await getExecOutput(bash)
    console.log(execOutput.stdout)
    //   set output
    core.setOutput('value', execOutput.stdout)
  } catch (err) {
    core.setFailed(err.message)
  }
}

const query = `
query ($owner: String!, $repo: String!, $pr: Int!, $endCursor: String) {
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
}
`
const bashScript = ({ owner, repo, pr, outType }) => {
  return `
echo "github api query commits of current pr"
gh api graphql \\
-f query='${query}' \\
-F owner='${owner}' \\
-F repo='${repo}' \\
-F pr=${pr} \\
--paginate \\
--jq '.data.repository.pullRequest.commits.nodes | map(.commit) | map({oid, authoredDate, committedDate, messageBody, messageHeadline, authors: .authors.nodes | map({name, login: .user.login})})' > commits_draft.json

echo "wrap commits_draft.json"
jq -s 'flatten' commits_draft.json | jq '{ commits: .}' > commits.json

echo "query changes then write to res.json"
curl -H "Accept-Charset: UTF-8" \\
--request POST \\
--location 'https://go-mentoroid-api.geniam.com/gh/commits2md' \\
--header 'Content-Type: application/json' \\
--data '@commits.json' | jq .${outType} -r

`
}

module.exports = {
  run
}
