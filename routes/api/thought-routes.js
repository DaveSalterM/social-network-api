const router = require("express").Router();
const {
  getAllThoughts,
  getThoughtsById,
  createThoughts,
  updateThoughts,
  deleteThoughts,
  addReaction,
  removeReaction,

} = require("../../controllers/thought-controller");


module.exports = router;