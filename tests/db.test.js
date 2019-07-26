import 'babel-polyfill';
import waitUntil from 'async-wait-until';
import sinon from 'sinon';
import { Product, db } from '../db/index';
import get from './utils/math';
var mongoose = require('mongoose');

describe('Product', () => {
  beforeAll(() => {});

  afterAll(() => {});

  it('should exist', () => {
    expect(true).toBe(true);
    expect(Product).toBeDefined();
  });

  it('should execute findOne queries in less than 50 ms', async () => {
    const id = Math.floor(Math.random() * 10000000);
    const result = await Product.findOne({ product_id: id }).explain();
    expect(result.executionStats.executionTimeMillis).toBeLessThan(50);
    const arr = [];
    arr.length = 1000;
    arr.fill(true);
    let times = arr.map(async el => {
      const id = Math.floor(Math.random() * 10000000);
      const result = await Product.findOne({ product_id: id }).explain();
      return result.executionStats.executionTimeMillis;
    });
    expect(
      Promise.all(times).then(times => {
        const avg = get.avg(times);
        console.log('Average query-by-index time', avg);
        return avg;
      })
    ).resolves.toBeLessThan(50);
  });
});
