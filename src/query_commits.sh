#!/bin/sh

while getopts q:o:r:p: flag
do
  case "${flag}" in
    q) query=${OPTARG};;
    o) owner=${OPTARG};;
    r) repo=${OPTARG};;
    p) pr=${OPTARG};;
    *) echo "usage: $0 [-v] [-r]" >&2
       exit 1 ;;
  esac
done

GH_CMD=$(which gh)

# request all commits for a PR
$GH_CMD api graphql \
-f query="$query" \
-F owner="$owner" \
-F repo="$repo" \
-F pr="$pr" \
--paginate \
--jq '.data.repository.pullRequest.commits.nodes | map(.commit) | map({oid, authoredDate, committedDate, messageBody, messageHeadline, authors: .authors.nodes | map({name, login: .user.login})})' | \

# format json
jq -s 'flatten' | jq '{ commits: .}' -r
