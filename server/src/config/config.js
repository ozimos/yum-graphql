export default {
  development: {
    username: 'root',
    password: 'password',
    database: 'Book-A-Meal_development',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  test: {
    username: 'root',
    password: 'password',
    database: 'Book-A-Meal_test',
    host: '127.0.0.1',
    dialect: 'postgres'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres'
  }
};
