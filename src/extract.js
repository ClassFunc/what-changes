const MarkdownIt = require('markdown-it')
const markdownItTable = require('markdown-it-multimd-table')
const md = new MarkdownIt().use(markdownItTable)

function extract(data, outputType) {
  let rows = []
  let numOfMergedPR = 0
  let numOfHotfix = 0
  let idx = 0

  data.commits.forEach(commit => {
    let isMergePRCommit = commit.messageHeadline.includes('Merge pull request')
    if (isMergePRCommit) {
      let prNumber = commit.messageHeadline.split(' ')[3]
      idx++
      numOfMergedPR++

      let authorLogins = getAuthors(commit.authors)
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

    let isHotfixCommit = replaceAllNoneAlphanumeric(
      commit.messageHeadline.toLowerCase()
    ).includes('hotfix')
    if (!isMergePRCommit && isHotfixCommit) {
      let prNumber = `[hotfix]<br/>${commit.oid}`
      idx++
      numOfHotfix++

      let authorLogins = getAuthors(commit.authors)
      rows.push([
        idx.toString(),
        prNumber,
        commit.messageHeadline,
        authorLogins,
        commit.authoredDate
      ])
    }
  })

  let MD =
    `| No. | PR | Title | By | Date |\n|-----|----|-------|----|------|\n` +
    rows.map(row => `| ${row.join(' | ')} |`).join('\n')

  let HTML = md.render(MD).replace(/\n/g, '')

  switch (outputType) {
    case 'markdown':
    case 'md':
      return MD
    case 'html':
      return HTML
    case 'json':
    case 'rows':
      return rows
    default:
      return {
        rows: rows,
        numOfMergedPR: numOfMergedPR,
        numOfHotfix: numOfHotfix,
        md: MD,
        html: HTML
      }
  }
}

function replaceAllNoneAlphanumeric(str) {
  return str.replace(/[^a-zA-Z0-9]+/g, '')
}

function getAuthors(authors) {
  return authors.map(author => author.login).join(', ')
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
