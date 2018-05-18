
import subDays from 'date-fns/sub_days';

import {
  expect,
  defaultMeal3,
  defaultMeal4,
  menuController
} from '../../../../testHelpers/controllerHelper';
import db from '../../../../src/models';

describe('Integration Controller Menu', () => {


  const phantomMealId = '91bf8437-b2f3-4e2b-a8ac-d86fd643dfb7';
  const body = {
    description: "Wednesday's Menu",
    meals: [defaultMeal3.id, defaultMeal4.id]
  };
  describe.skip('No Menu:', () => {
    it('returns error message if the menu for the day is not set', async () => {
      const response = await menuController.getMenu();
      expect(response.message).to.equal('menu for the day has not been set');
      expect(response.statusCode).to.equal(404);
    });
  });

  describe.skip('Empty Menu:', () => {
    db.Menu.upsert({
      title: 'Today',
    });
    it('returns error message if the menu for the day is not set', async () => {
      const response = await menuController.getMenu();
      expect(response.message).to.equal('menu for the day has not been set');
      expect(response.statusCode).to.equal(404);
    });
  });
  describe.skip('Old Menu:', () => {

    const pastDay2 = subDays(new Date(), 2);
    db.Menu.upsert({
      title: 'Today',
      updatedAt: pastDay2
    });
    it('returns error message if the menu has not been set for today ', async () => {

      const response = await menuController.getMenu();
      expect(response.message).to.equal('menu for the day has not been set');
      expect(response.statusCode).to.equal(404);
    });
  });
  describe('Post Menu: Success', () => {

    it('postMenu posts the menu for the day', async () => {

      const response = await menuController.postMenu({
        body
      });
      expect(response.data.description).to.equal(body.description);
      // eslint-disable-next-line
      expect(response.data.Meals[0].id).to.exist;
      expect(response.statusCode).to.equal(201);
    });
    it('getMenu returns the menu for the day', async () => {
      const response = await menuController.getMenu();
      expect(response.data.description).to.equal(body.description);
      // eslint-disable-next-line
      expect(response.data.Meals[0].id).to.exist;
      expect(response.statusCode).to.equal(200);
    });

  });
  describe('Post Menu: Fail', () => {
    it('postMenu returns error message if meal is not in db', async () => {
      const req = {
        body: {
          description: "Wednesday's Menu",
          meals: [phantomMealId]
        }
      };
      const response = await menuController.postMenu(req);
      expect(response.message).to.equal('Menu was not posted. Try again');
      expect(response.statusCode).to.equal(404);
    });
    it('getMenu returns error message after invalid meal is set', async () => {
      const response = await menuController.getMenu();
      expect(response.message).to.equal('menu for the day has not been set');
      expect(response.statusCode).to.equal(404);
    });
  });
  describe('Post Menu: Sets Environment variables', () => {
    const hour = new Date().getHours();
    const mins = new Date().getMinutes();
    it('postMenu sets the environment variables', async () => {

      await menuController.postMenu({
        body
      });
      expect(process.env.ORDER_START_HOUR).to.equal(hour.toString());
      expect(parseInt(process.env.ORDER_START_MINS, 10)).to.be.closeTo(mins, 1);
    });
  });
});