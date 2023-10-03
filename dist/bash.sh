#!/bin/sh

while getopts q:o:r:p:t: flag
do
  case "${flag}" in
    q) query=${OPTARG};;
    o) owner=${OPTARG};;
    r) repo=${OPTARG};;
    p) pr=${OPTARG};;
    t) outType=${OPTARG};;
    *) echo "usage: $0 [-v] [-r]" >&2
       exit 1 ;;
  esac
done

GHCMD=$(which gh)
#echo "ghcmd: $GHCMD"
$GHCMD api graphql \
-f query="$query" \
-F owner="$owner" \
-F repo="$repo" \
-F pr="$pr" \
--paginate \
--jq '.data.repository.pullRequest.commits.nodes | map(.commit) | map({oid, authoredDate, committedDate, messageBody, messageHeadline, authors: .authors.nodes | map({name, login: .user.login})})' | \
jq -s 'flatten' | jq '{ commits: .}' | \
curl -H "Accept-Charset: UTF-8" \
--silent \
--request POST \
--location 'https://go-mentoroid-api.geniam.com/gh/commits2md' \
--header 'Content-Type: application/json' \
--data '@-' | jq ."$outType" -r