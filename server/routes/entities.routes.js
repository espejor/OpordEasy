const express = require ('express');    
const router = express.Router();

const entityCtrl = require ('../controllers/entity.controller');

// Routes predefinidas

router.get('/', entityCtrl.getEntities)
router.get('/:id', entityCtrl.getEntity)
router.put('/:id', entityCtrl.updateEntity)
router.delete('/:id', entityCtrl.deleteEntity)
router.post('/', entityCtrl.createEntity)
// router.get('/Units', () => {console.log('---------- UNITS')})



// exportamos las rutas
module.exports = router;
