//packages and libraries
const express = require('express');
const usersHandler = require('../../handlers/userHandler');


router = express.Router();

router.route('/userBasicInfo')
        .get(usersHandler.userInfo);


module.exports = router;