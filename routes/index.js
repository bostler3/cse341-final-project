const router = require("express").Router();

router.get("/", (req, res) => {
	res.status(200).json({
		message: "Movie API is running",
		endpoints: ["/movies", "/actors", "/api-docs"]
	});
});

router.use('/movies', require('./movies'));

router.use("/actors", require("./actors"));

module.exports = router;
