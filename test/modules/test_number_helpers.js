import 'babel-polyfill';
import { describe, it } from 'mocha';
import assert from 'assert';
import { addCommas } from '../../src/modules/number_helpers';


describe('Number Helper Module', () => {
  describe('addCommas', () => {
    it('should format 100 correctly', () => {
      assert.equal(addCommas(100), '100');
    });

    it('should format 1234567890 correctly', () => {
      assert.equal(addCommas(1234567890), '1,234,567,890');
    });

    it('should format -10000 correctly', () => {
      assert.equal(addCommas(-10000), '-10,000');
    });

    it('should not format `this string`', () => {
      assert.equal(addCommas('this string'), 'this string');
    });
  });
});
