const fs = require('fs');

const Current = function() {
  this.current = 0;
};

Current.prototype.get = function() {
  return this.current;
};
Current.prototype.inc = function() {
  this.current++;
  if (this.current > 10000) {
    this.current = 1;
  }
  return this.current;
};

const current = new Current();

const makeArray = function(length, fakeThing) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(fakeThing());
  }
  return array;
};

const makeSpec = function() {
  return {
    title: current.get(),
    spec: current.get(),
  };
};

makeImage = function() {
  return {
    smallName: current.get(),
    largeName: current.get(),
  };
};

const makeReview = function() {
  return {
    images: makeArray(1, makeImage),
    title: current.get(),
    rating: current.get(),
    date: new Date(),
    recommended: true,
    text: current.get(),
    author: current.get(),
    verifiedPurchaser: true,
    sweepstakesEntry: true,
    helpful: {
      yes: true,
      no: false,
    },
  };
};

const makeQuestion = function() {
  return {
    question: current.get(),
    author: current.get(),
    date: new Date(),
    answers: makeArray(1, current.get),
  };
};

const makeAnswer = function() {
  return {
    badgeName: current.get(),
    author: current.get(),
    date: new Date(),
    text: current.get(),
    helpful: {
      yes: current.get(),
      no: current.get(),
    },
  };
};

const makeProduct = function() {
  current.inc();
  return {
    product_id: current.get(),
    descriptions: {
      overview: current.get(),
      list: makeArray(1, current.get),
    },
    specs: makeArray(1, makeSpec),
    reviews: makeArray(1, makeReview),

    reviewStats: {
      reviewCount: current.get(),
      percentRecommended: current.get(),
      averageStars: current.get(),
      starCounts: {
        five: current.get(),
        four: current.get(),
        three: current.get(),
        two: current.get(),
        one: current.get(),
      },
    },
    questions: makeArray(1, makeQuestion),
  };
};

const writeProducts = function(n) {
  const start = new Date();
  const products = [];
  for (let i = 0; i < n; i++) {
    const product = makeProduct();
  }
};

module.exports = makeProduct;
