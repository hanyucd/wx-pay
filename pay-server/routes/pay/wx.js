let express = require('express');
let router = express.Router();

/**
 * 用户授权重定向
 */
router.get('/redirect', function (req, res) {
	res.json({
		code: 0,
		data: 'test',
		message: ''
	});
});

module.exports = router;
