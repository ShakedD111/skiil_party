//packages and libraries
const express = require('express');
const usersHandler = require('../../handlers/userHandler');


router = express.Router();

/////router.use('/connection', require('./routers/connectionAPI'));

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
router.route('/:userName')
        .get(usersHandler.getEntity);

router.route('/usersList')
        .get(usersHandler.getEntities);
        
router.route('/userLogin')
        .post(usersHandler.logIn);//need to add an amount of objects that can be returned 

router.route('/manage')
        .post(usersHandler.createEntity)// add a new user
        .put(usersHandler.updateEntity) // Update an existing user
        .delete(usersHandler.deleteEntity); // Delete an existing user

        //in update:::::
 //check valid connections

    //check valid tournaments

    //check valid tournaments

    //check valid parties


/*router.route('/userBasicInfo')
        .get(usersHandler.userInfo);*/


module.exports = router;