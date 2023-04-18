const express = require('express');

const router = express.Router();

const {
  addUser,
  getUsers,
  updateUser,
  deleteUser,
} = require('../controller/user.controller');

router.post('/user', addUser);
router.get('/user/api', getUsers);
router.patch('/update/:id', updateUser);
router.delete('/delete/:id', deleteUser);

module.exports = router;
