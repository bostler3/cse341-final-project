const getAllActors = async (req, res) => {
  res.status(200).json({
    message: 'GET /actors is wired. CRUD implementation coming next.',
  });
};

const getActorById = async (req, res) => {
  res.status(200).json({
    message: `GET /actors/${req.params.id} is wired. CRUD implementation coming next.`,
  });
};

module.exports = {
  getAllActors,
  getActorById,
};
