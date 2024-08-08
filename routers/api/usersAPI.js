//packages and libraries
const express = require('express');
const usersHandler = require('../../handlers/userHandler');


router = express.Router();

/*need list:
        1.register
        2.delete
        3.update
        4.user info
                4.1.user parties
                4.2.user tournaments
                4.3.user connections
        5.is exist
*/

router.route('/isExists')
        .post(usersHandler.isExists);//ned to add an amount of objects that can be returned 

router.route('/userModify')
        .post(usersHandler.createUser)// add a new user
        .put(usersHandler.updateUser) // Update an existing user
        .delete(); // Delete an existing user

        //in update:::::
 //check valid connections

    //check valid tournaments

    //check valid tournaments

    //check valid parties


router.route('/userBasicInfo')
        .get(usersHandler.userInfo);


module.exports = router;