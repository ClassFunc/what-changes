const MarkdownIt = require('markdown-it')
const markdownItTable = require('markdown-it-multimd-table')
const md = new MarkdownIt().use(markdownItTable)

/**
 * Extracts the PR changes from the GraphQL response.
 * @param data
 * @param outputType
 * @returns {{total: number, numOfMergedPR: number, numOfHotfix: number, value: string}|{total: number, numOfMergedPR: number, numOfHotfix: number, value: *}|{total: number, numOfMergedPR: number, numOfHotfix: number, value: *[]}|{total: number, numOfMergedPR: number, numOfHotfix: number, value: {md: string, html: *, rows: *[]}}}
 */

function extract(data, outputType) {
  const rows = []
  let numOfMergedPR = 0
  let numOfHotfix = 0
  let idx = 0
  for (const commit of data.commits) {
    const isMergePRCommit =
      commit.messageHeadline.includes('Merge pull request')
    if (isMergePRCommit) {
      const prNumber = commit.messageHeadline.split(' ')[3]
      idx++
      numOfMergedPR++

      const authorLogins = getAuthors(commit.authors)
      rows.push([
        idx.toString(),
        prNumber,
        removeAllFirstEmptyLines(
          removeAllLinesStartsWith(commit.messageBody, '…')
        ).replace(/\n/g, '<br/>'),
        authorLogins,
        commit.authoredDate
      ])
    }

    const isHotfixCommit = replaceAllNoneAlphanumeric(
      commit.messageHeadline.toLowerCase()
    ).includes('hotfix')
    if (!isMergePRCommit && isHotfixCommit) {
      const prNumber = `[hotfix]<br/>${commit.oid}`
      idx++
      numOfHotfix++

      const authorLogins = getAuthors(commit.authors)
      rows.push([
        idx.toString(),
        prNumber,
        commit.messageHeadline,
        authorLogins,
        commit.authoredDate
      ])
    }
  }

  const MD = `| No. | PR | Title | By | Date |\n|-----|----|-------|----|------|\n${rows
    .map(row => `| ${row.join(' | ')} |`)
    .join('\n')}`

  const HTML = md.render(MD).replace(/\n/g, '')

  const res = {
    numOfMergedPR,
    numOfHotfix,
    total: rows.length
  }
  switch (outputType) {
    case 'markdown':
    case 'md':
      return {
        ...res,
        value: MD
      }
    case 'html':
      return {
        ...res,
        value: HTML
      }
    case 'json':
    case 'rows':
      return {
        ...res,
        value: rows
      }
    default:
      return {
        ...res,
        value: {
          rows,
          md: MD,
          html: HTML
        }
      }
  }
}

function replaceAllNoneAlphanumeric(str) {
  return str.replace(/[^a-zA-Z0-9]+/g, '')
}

function getAuthors(authors) {
  return authors.map(author => `@${author.login}`).join(', ')
}

function removeAllLinesStartsWith(str, withStr = '...') {
  return str
    .split('\n')
    .filter(line => !line.startsWith(withStr))
    .join('\n')
}

function removeAllFirstEmptyLines(str) {
  return str
    .split('\n')
    .filter(line => line.trim() !== '')
    .join('\n')
}

module.exports = {
  extract
}
