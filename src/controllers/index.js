import { Router } from "express";

const router = Router();


const homepage = (req, res) => {
    res.render('home', { title: 'Home' });
}

router.get('/', homepage);



export default router;