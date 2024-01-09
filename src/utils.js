src/utils.js:

const core = require('@actions/core');

function handleError(errorMessage) {
  core.error(errorMessage);
  core.setFailed(errorMessage);
}

module.exports = {
  handleError
};
