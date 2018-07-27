const subTotal = meals => meals
  .reduce((accum, meal) => accum + (meal.price * meal.MealOrders.quantity), 0);
export { subTotal };
export default orders => orders.reduce((accum, order) => accum + subTotal(order.Meals), 0);