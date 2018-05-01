/* eslint import/no-extraneous-dependencies: off */
import { assert } from 'chai';
import schema from '../../../src/middleware/menuSchemas';

context('Validation with Joi schemas', () => {
  // sample request body data
  const menu = {
    description: 'Continental, Local',
    meals: [
      {
        id: 3,
        title: 'Beef with Spaghetti',
        description: 'spaghetti with ground beef',
        price: 1500
      },
      {
        id: 2,
        title: 'Beef with Fries',
        description: 'beef slab with fried potato slivers',
        price: 2000
      }
    ]
  };

  describe('for POST requests on /api/v1/menu, validation', () => {
    it('throws error when some required fields are not in request body', () => {
      const modified = { ...menu };
      delete modified.description;
      const result = schema.validate(modified);
      assert.notEqual(result.error, null, `Joi output: ${result.error}`);
    });
    it('throws error when unknown fields are in request body', () => {
      const modified = { ...menu };
      modified.volume = 'high';
      const result = schema.validate(modified);
      assert.notEqual(result.error, null, `Joi output: ${result.error}`);
    });

    it('does not throw error when all required fields are in request body', () => {
      const result = schema.validate(menu);
      assert.equal(result.error, null, `Joi output: ${result.error}`);
    });
  });
});
