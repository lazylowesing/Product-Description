const { Product } = require('../index');
const { getQueryTimes, getQueriesPerSecond } = require('./performanceTest');

const query = function(condition) {
  return Product.findOne(condition);
};

getQueryTimes(query).then(result => {
  console.log(result);
});
