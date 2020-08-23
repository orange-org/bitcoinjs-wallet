/* eslint-disable no-console */

// `fetch` is not available in Jest. This brings it in.
require('isomorphic-fetch');

// https://github.com/facebook/jest/issues/3251#issuecomment-299183885
if (!process.env.LISTENING_TO_UNHANDLED_REJECTION) {
  process.on('unhandledRejection', (reason) => {
    console.log('REJECTION', reason);
  });

  // Avoid memory leak by adding too many listeners
  process.env.LISTENING_TO_UNHANDLED_REJECTION = true;
}
