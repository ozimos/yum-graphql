/* eslint import/no-extraneous-dependencies: off */
import { expect } from 'chai';
import MenuController from '../../../src/controllers/menuController';

const errorResponse = {
  message: 'records unavailable',
  statusCode: 404
};
const menu = {
  description: 'Friday Menu',
  meals: [
    {
      id: 1,
      title: 'Beef with Rice',
      description: 'plain rice with ground beef',
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

describe('getMenu()', () => {
  const req = {};
  it('should return a menu when menu model exists', () => {
    const menuCopy = { ...menu };
    const menuController = new MenuController(menuCopy);
    const expected = {
      message: { ...menuCopy },
      statusCode: 200
    };
    expect(menuController.getMenu()).to.eql(expected);
  });
  it('should return error message when no menu model exists', () => {
    const menuCopy = null;
    const menuController = new MenuController(menuCopy);
    expect(menuController.getMenu(req)).to.eql(errorResponse);
  });
});
describe('postMenu()', () => {
  it('should set the menu for the day', () => {
    const req = {
      body: {
        description: 'Thursday Menu',
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
      }
    };
    const menuCopy = { ...menu };
    const menuController = new MenuController(menuCopy);
    const expected = {
      message: { ...req.body },
      statusCode: 201
    };
    expect(menuController.postMenu(req)).to.eql(expected);
  });
});
