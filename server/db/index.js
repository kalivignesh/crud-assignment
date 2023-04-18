const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('userTable', 'root', '123456789', {
  dialect: 'mysql',
  host: 'localhost',
  port: 3306,
});

const User = sequelize.define('User', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },

  contactNo: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  location: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});
sequelize
  .sync()
  .then(() => {
    console.log('Users table created');
  })
  .catch(err => {
    console.error('Error creating Users table', err);
  });


module.exports = User;
