const subTotal = meals => (meals ? meals
  .reduce((accum, meal) => (accum + meal.dataValues.subTotal), 0)
  : 0);
export { subTotal };
export default orders => (orders ? orders
  .reduce((accum, order) => (accum + subTotal(order.Meals)), 0) : 0);