var MongoClient = require('mongodb').MongoClient;
var url = 'mongodb://localhost:27017/products';

async function runTest() {
  const connection = await MongoClient.connect(url);
  const db = await connection.db(global.products);
  const products = db.collection('products');

  const randomId = function() {
    return Math.floor(Math.random() * 10000000);
  };

  const getTimes = async function() {
    const arr = [];
    arr.length = 10000;
    arr.fill(true);
    const times = arr.map(async el => {
      const id = randomId();
      const result = await products.find({ product_id: id }).explain();
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

  const getAvgQueryTime = async function() {
    const times = await getTimes();
    console.log(
      'Queries tested',
      times.length,
      'Average query time (ms)',
      avg(times),
      'Max time (ms)',
      Math.max(...times),
      'Min time (ms)',
      Math.min(...times),
      'Median time (ms)',
      times.sort()[Math.floor(times.length / 2)]
    );
    return avg(times);
  };
  // getAvgQueryTime();
  const getQueriesPerSecond = function() {
    let count = 0;
    let start = Date.now();
    let seconds = 10;
    const query = async function() {
      if (Date.now() > start + 1000 * seconds) {
        console.log('Queries per second:  ', count / seconds);
        return;
      }
      const id = randomId();
      const result = await products.find({ product_id: id });
      count++;
      query();
    };
    query();
  };
  getHitsPerSecond();
}

module.exports = {
  getAvgQueryTime,
  getQueriesPerSecond,
};
