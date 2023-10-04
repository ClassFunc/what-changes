function queryFn() {
  return `query ($owner: String!, $repo: String!, $pr: Int!, $endCursor: String) {
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
}

module.exports = {
  query: queryFn()
}
