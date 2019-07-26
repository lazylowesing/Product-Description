const faker = require('faker');
const fs = require('fs');

const randomThing = function() {
  const randomThings = [
    faker.commerce.color,
    faker.commerce.department,
    faker.commerce.productName,
    faker.commerce.productAdjective,
    faker.commerce.productMaterial,
    faker.commerce.product,
    faker.company.catchPhrase,
    faker.company.bs,
    faker.company.catchPhraseAdjective,
    faker.company.catchPhraseDescriptor,
    faker.company.catchPhraseNoun,
    faker.company.bsBuzz,
    faker.company.bsNoun,
    faker.hacker.adjective,
    faker.hacker.phrase,
    faker.name.jobArea,
    faker.name.jobDescriptor,
    faker.name.jobDescriptor,
    faker.name.jobType,
    faker.random.words,
  ];
  return randomThings[random(randomThings.length)]();
};

const randomNoun = function() {
  const nouns = [
    faker.commerce.color,
    faker.commerce.department,
    faker.commerce.productName,
    faker.commerce.productMaterial,
    faker.commerce.product,
    faker.company.catchPhrase,
    faker.company.catchPhraseNoun,
    faker.company.bsNoun,
    faker.name.jobArea,
    faker.name.jobDescriptor,
    faker.name.jobType,
  ];
  return nouns[random(nouns.length)]();
};

const randomAdjective = function() {
  const adjectives = [
    faker.commerce.color,
    faker.commerce.productAdjective,
    faker.commerce.productMaterial,
    faker.company.catchPhraseAdjective,
    faker.company.catchPhraseDescriptor,
    faker.company.bsBuzz,
    faker.hacker.adjective,
    faker.name.jobArea,
    faker.name.jobDescriptor,
  ];
  return adjectives[random(adjectives.length)]();
};

const randomSentence = function() {
  return (
    randomNoun() +
    ' ' +
    faker.hacker.verb() +
    ' ' +
    randomAdjective() +
    ' ' +
    randomNoun()
  );
};

const random = function(n) {
  return Math.floor(Math.random() * n);
};

const makeArray = function(length, fakeThing) {
  const array = [];
  for (let i = 0; i < length; i++) {
    array.push(fakeThing());
  }
  return array;
};

const makeSpec = function() {
  return {
    title: faker.commerce.product(),
    spec:
      faker.commerce.productAdjective() +
      ' ' +
      faker.commerce.productMaterial(),
  };
};

makeImage = function() {
  return {
    smallName: random(10000).toString(),
    largeName: random(1000).toString(),
  };
};

const makeReview = function() {
  return {
    images: makeArray(random(5), makeImage),
    title: randomThing(),
    rating: random(5),
    date: faker.date.recent(),
    recommended: faker.random.boolean(),
    text: randomSentence(),
    author: faker.name.firstName(),
    verifiedPurchaser: faker.random.boolean(),
    sweepstakesEntry: faker.random.boolean(),
    helpful: {
      yes: faker.random.number(),
      no: faker.random.number(),
    },
  };
};

const makeQuestion = function() {
  return {
    question: faker.random.words() + '?',
    author: faker.name.firstName(),
    date: faker.date.past(),
    answers: makeArray(random(10), makeAnswer),
  };
};

const makeAnswer = function() {
  return {
    badgeName: randomThing(),
    author: faker.name.firstName(),
    date: faker.date.recent(),
    text: randomThing(),
    helpful: {
      yes: random(100),
      no: random(100),
    },
  };
};

const makeProduct = function() {
  return {
    product_id: faker.finance.account(),
    descriptions: {
      overview: randomThing(),
      list: makeArray(random(8), randomThing),
    },
    specs: makeArray(random(6), makeSpec),
    reviews: makeArray(random(12), makeReview),

    reviewStats: {
      reviewCount: random(500),
      percentRecommended: random(100),
      averageStars: random(5),
      starCounts: {
        five: random(100),
        four: random(100),
        three: random(100),
        two: random(100),
        one: random(100),
      },
    },
    questions: makeArray(random(10), makeQuestion),
  };
};

const current = 0;

const makeProductSmall = function() {
  current++
  return {
    product_id: current,
    descriptions: {
      overview: current,
      list: [current],
    },
    specs: [current],
    reviews: [current],

    reviewStats: {
      reviewCount: current,
      percentRecommended: current,
      averageStars: current,
      starCounts: {
        five: current,
        four: current,
        three: current,
        two: current,
        one: current,
      },
    },
    questions: [makeArray(random(10), makeQuestion)],
  };
};

const writeProducts = function(n) {
  const start = new Date();
  const products = [];
  for (let i = 0; i < n; i++) {
    products.push(makeProduct());
  }
  fs.writeFile('data.json', JSON.stringify(products), 'utf8', err => {
    if (err) {
      console.error(err);
    } else {
      console.info('Execution Time ', new Date() - start);
    }
  });
};

writeProducts(10000);
