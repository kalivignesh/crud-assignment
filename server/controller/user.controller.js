const User = require('../db/index');

const addUser = async (req, res) => {
  try {
    console.log(req.body);

    const { name, email, contactNo, location } = req.body;


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
};

const getUsers = async (req, res) => {
  try {
    let users = await User.findAll({});

    res.status(200).send({ message: 'succesfully fetched users', users });
  } catch (e) {
    res.status(400).send({ message: 'something went wrong' });
    console.log(e);
  }
};

const updateUser = async (req, res) => {
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
};
const deleteUser = async (req, res) => {
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
};

module.exports = {
  addUser,
  getUsers,
  updateUser,
  deleteUser,
};
