import { Router } from "express";


const router = Router();

function placeholderController(req, res) {
  res.render('placeholder', { title: 'Home' });
}

router.get('/', placeholderController);







export default router;
