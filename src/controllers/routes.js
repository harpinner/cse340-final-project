import { Router } from "express";
import vehicleRoutes from "./vehicle.js";
import accountRoutes from "./account.js";
import blogRoutes from "./blog.js";
import indexRoutes from "./index.js";
import adminRoutes from "./admin.js";
import serviceRoutes from "./service.js";
import conactRoutes from "./messages.js";

const router = Router();


router.use('/vehicles', vehicleRoutes);
router.use('/accounts', accountRoutes);
router.use('/account', accountRoutes);
router.use('/blog', blogRoutes);
router.use('/admin', adminRoutes);
router.use('/contacts', conactRoutes);
router.use('/services', serviceRoutes);
router.get('/login', (req, res) => res.redirect('/accounts/login'));
router.get('/register', (req, res) => res.redirect('/accounts/register'));
router.get('/logout', (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      return next(error);
    }
    res.redirect('/');
  });
});
router.use('/', indexRoutes);

export default router;
