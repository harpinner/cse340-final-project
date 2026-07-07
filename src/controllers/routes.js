import { Router } from "express";
import vehicleRoutes from "vehicle.js";
import accountRoutes from "account.js";




const router = Router();
router.use('/vehicles', vehicleRoutes);
router.use('/accounts', accountRoutes);
function placeholderController(req, res) {
  res.render('placeholder', { title: 'Home' });
}

router.get('/', placeholderController);







export default router;
