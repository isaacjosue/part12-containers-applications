const express = require('express');
const { getAsync } = require('../redis')
const router = express.Router();

/* GET index data. */
router.get('/', async (req, res) => {
  const added_todos = await getAsync('added_todos')

  res.send({
    added_todos: added_todos || 0
  });
});

module.exports = router;
