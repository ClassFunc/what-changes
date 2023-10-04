
QUERY='
query($owner: String!, $repo: String!, $pr: Int!, $endCursor: String) {
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
}'

echo "${QUERY}"
gh api graphql \
-F owner="ClassFunc" \
-F repo="what-changes" \
-F pr="5" \
-f query="${QUERY}" \
--paginate \
--jq '.data.repository.pullRequest.commits.nodes | map(.commit) | map({oid, authoredDate, committedDate, messageBody, messageHeadline, authors: .authors.nodes | map({name, login: .user.login})})' | \
jq -s 'flatten' | \
jq '{ commits: .}' -r
