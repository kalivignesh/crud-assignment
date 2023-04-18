/* eslint consistent-return:0 import/order:0 */

const express = require('express');
const logger = require('./logger');

const argv = require('./argv');
const port = require('./port');
const setup = require('./middlewares/frontendMiddleware');
const { Sequelize } = require('sequelize');

const isDev = process.env.NODE_ENV !== 'production';
const ngrok =
  (isDev && process.env.ENABLE_TUNNEL) || argv.tunnel
    ? require('ngrok')
    : false;
const { resolve } = require('path');
const app = express();

// If you need a backend, e.g. an API, add your custom backend-specific middleware here
// app.use('/api', myApi);

app.use(express.json());

app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');
  res.setHeader('Access-Control-Allow-Methods', 'DELETE,PATCH,POST');

  next();
});
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

app.use("/new",(req,res)=>{
  res.send("Neww")
})

app.post('/user', async function(req, res) {
  try {
    console.log(req.body);

    const { name, email, contactNo, location } = req.body;

    console.log(name, email, contactNo, location);

    let user = await User.create({
      name: name,
      email: email,
      contactNo: contactNo,
      location: location,
    });

    res.status(200).send({ message: 'succesfully user added' });
  } catch (e) {
    res.status(400).send({ message: 'something went wrong' });
    console.log(e);
  }
});
app.get('/user/api', async (req, res) => {
  try {
    let users = await User.findAll({});

    console.log(users);
    res.status(200).send({ message: 'succesfully fetched users', users });
  } catch (e) {
    res.status(400).send({ message: 'something went wrong' });
    console.log(e);
  }
});
app.patch('/update/:id', async (req, res) => {
  try {
    const { name, email, contactNo, location } = req.body;

    let user = await User.update(
      {
        name: name,
        email: email,
        contactNo: contactNo,
        location: location,
      },
      { where: { id: req.params.id } },
    );

    res.status(200).send({ message: 'succesfully user updated' });
  } catch (e) {
    res.status(400).send({ message: 'something went wrong' });
    console.log(e);
  }
});
app.delete('/delete/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id,
      },
    });
    await user.destroy();

    res.status(200).send({ message: 'succesfully user deleted' });
  } catch (e) {
    res.status(400).send({ message: 'something went wrong' });
    console.log(e);
  }
});

// In production we need to pass these values in instead of relying on webpack
setup(app, {
  outputPath: resolve(process.cwd(), 'build'),
  publicPath: '/',
});

// get the intended host and port number, use localhost and port 3000 if not provided
const customHost = argv.host || process.env.HOST;
const host = customHost || null; // Let http.Server use its default IPv6/4 host
const prettyHost = customHost || 'localhost';

// use the gzipped bundle
app.get('*.js', (req, res, next) => {
  req.url = req.url + '.gz'; // eslint-disable-line
  res.set('Content-Encoding', 'gzip');
  next();
});

// Start your app.
app.listen(port, host, async err => {
  if (err) {
    return logger.error(err.message);
  }

  // Connect to ngrok in dev mode
  if (ngrok) {
    let url;
    try {
      url = await ngrok.connect(port);
    } catch (e) {
      return logger.error(e);
    }
    logger.appStarted(port, prettyHost, url);
  } else {
    logger.appStarted(port, prettyHost);
  }
});
