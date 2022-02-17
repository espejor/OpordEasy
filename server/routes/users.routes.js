
const express = require ('express');    
const router = express.Router();

const userCtrl = require ('../controllers/user.controller');

// Routes predefinidas

router.get('/', userCtrl.getUsers)
   // '/register/',() => {console.log("----------------- funciona")}) 
router.post('/register/', userCtrl.register)
router.post('/login/', userCtrl.login)
// router.put('/:id', userCtrl.updateUser)
// router.delete('/:id', userCtrl.deleteUser)



// exportamos las rutas
module.exports = router;







//------------------------------------------------------------------------





// module.exports = app;
