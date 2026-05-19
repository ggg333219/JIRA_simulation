const originalFetch = window.fetch;

window.fetch = function (...args) {
  const failureRate = localStorage.getItem('__jira_failure_rate__');

  if (failureRate && parseFloat(failureRate) > 0) {
    const url = args[0];
    const init = args[1] || {};

    if (!init.headers) {
      init.headers = {};
    }

    init.headers['x-jira-fail'] = '1';

    args[1] = init;
  }

  return originalFetch.apply(this, args);
};
