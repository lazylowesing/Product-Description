var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/products', {
  useNewUrlParser: true,
});

const Current = function() {
  this.current = 0;
};

Current.prototype.get = function() {
  return this.current;
};
Current.prototype.inc = function() {
  this.current++;
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

const makeImage = function() {
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

const makeProductsArray = function() {
  const products = [];
  for (let i = 0; i < 100000; i++) {
    products.push(makeProduct());
  }
  return products;
};

const seedDB = async function(n) {
  console.log('seeding');
  for (let i = 0; i < n; i++) {
    const start = new Date();
    const products = makeProductsArray();
    await Product.collection.insertMany(products);
    const end = new Date();
    console.log(i, end - start);
  }
};

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', async function() {
  // console.log('connnected!');
  // seedDB(100);
});

var Schema = mongoose.Schema;

var SessionSchema = new mongoose.Schema({
  customerID: String,
  timeStamp: { type: Date, default: Date.now },
  responses: [String],
  reviews: [Number],
  questions: [Number],
});

var ReportSchema = new mongoose.Schema({
  product_id: Number,
  review_id: String,
  reported_by: String,
});

var ProductSchema = new mongoose.Schema({
  product_id: Number,
  descriptions: {
    overview: String,
    list: [String],
  },
  specs: [
    {
      title: String,
      spec: Schema.Types.Mixed,
    },
  ],
  reviews: [
    {
      images: [
        {
          smallName: String,
          largeName: String,
        },
      ],
      title: String,
      rating: Number,
      date: String,
      recommended: Boolean,
      text: String,
      author: String,
      verifiedPurchaser: Boolean,
      sweepstakesEntry: Boolean,
      helpful: {
        yes: Number,
        no: Number,
      },
    },
  ],
  reviewStats: {
    reviewCount: Number,
    percentRecommended: String,
    averageStars: String,
    starCounts: {
      five: Number,
      four: Number,
      three: Number,
      two: Number,
      one: Number,
    },
  },
  questions: [
    {
      question: String,
      author: String,
      date: String,
      answers: [
        {
          badgeName: String,
          author: String,
          date: String,
          text: String,
          helpful: {
            yes: Number,
            no: Number,
          },
        },
      ],
    },
  ],
});

const Product = mongoose.model('Product', ProductSchema);
const Session = mongoose.model('Session', SessionSchema);
const Report = mongoose.model('Report', ReportSchema);

// let data = require("../data/product43.json");
// const product = new Product({product_id: 43 ,...data});

// function saveIt(i) {
//   i = i || 1
//   if(i > 2) {return;}
//     let data = require(`../data/product${i}.json`);
//     let product = new Product({product_id: `${i}` ,...data});
//     product.save((err, data) => {
//       if (err) {
//         console.log(err);
//       } else {
//         console.log("success");
//         saveIt(++i)
//       }
//     });
//   }

//   saveIt();

module.exports = {
  Product,
  Session,
  Report,
  db,
};
