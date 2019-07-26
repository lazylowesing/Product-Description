const randomId = function() {
  return Math.floor(Math.random() * 10000000);
};
const getTimes = async function(query) {
  const arr = [];
  arr.length = 1000;
  arr.fill(true);
  const times = arr.map(async el => {
    const id = randomId();
    const result = await query({ product_id: id }).explain();
    return result.executionStats.executionTimeMillis;
  });
  return Promise.all(times);
};

const avg = function(arr) {
  let sum = 0;
  for (let num of arr) {
    sum += num;
  }
  return sum / arr.length;
};
const getQueryTimes = async function(query) {
  const times = await getTimes(query);
  return (
    'Queries tested ' +
    times.length +
    ' Average query time (ms) ' +
    avg(times) +
    ' Max time (ms) ' +
    Math.max(...times) +
    ' Min time (ms) ' +
    Math.min(...times) +
    ' Median time (ms) ' +
    times.sort()[Math.floor(times.length / 2)]
  );
};

const getQueriesPerSecond = function(query) {
  let count = 0;
  let seconds = 1;
  let start = Date.now();
  const runQuery = async function() {
    if (Date.now() > start + 1000 * seconds) {
      //   console.log('Queries per second:  ', count / seconds);
      return count / seconds;
    }
    const id = randomId();
    const result = await query({ product_id: id });
    count++;
    return runQuery();
  };
  return runQuery();
};

module.exports = {
  getQueryTimes,
  getQueriesPerSecond,
};
