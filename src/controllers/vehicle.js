import { getVehicleById, createVehicle, updateVehicle as updateVehicleInDb, deleteVehicle as deleteVehicleInDb, getAllVehicles } from "../models/vehicles.js";
import { getReviewsByVehicleId, createReview, deleteReview, updateReview, getAllReviews} from "../models/reviews.js";
import { getVehicleImageByVehicleId, createVehicleImage, updateVehicleImage, deleteVehicleImage } from "../models/vehicles.js";
import { getCategoryById, getAllCategories } from "../models/categories.js";
import { Router } from "express";
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, '..', '..', 'public', 'images', 'vehicles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const slug = (value) => String(value || 'vehicle')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    const baseName = [slug(req.body.make), slug(req.body.model), slug(req.body.year)].join('-');
    const extension = path.extname(file.originalname).toLowerCase();
    let sequence = 1;
    let filename = `${baseName}-${sequence}${extension}`;

    while (fs.existsSync(path.join(uploadDir, filename))) {
      sequence += 1;
      filename = `${baseName}-${sequence}${extension}`;
    }

    cb(null, filename);
  }
});

const upload = multer({ storage });


const getVehicle = async (req, res) => {
    const { id } = req.params;
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }
    const reviews = await getReviewsByVehicleId(id);
    // res.status(200).json(vehicle);
    res.render('vehicleDetail', { title: 'Vehicle Detail', vehicle: vehicle, reviews: reviews });
}
    
const createNewVehicle = async (req, res) => {
    const { make, model, year, price, category, description } = req.body;

    const imagePath = req.file ? `/images/vehicles/${req.file.filename}` : null;


    const newVehicle = await createVehicle(make, model, year, price, category, description);
    if (imagePath) {
        await createVehicleImage(newVehicle.id, imagePath);
    }   
    //res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
    res.redirect(`/vehicles/${newVehicle.id}`); // Redirect to the vehicle detail page after creating the vehicle
}

const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { make, model, year, price, category, description } = req.body;
    const updatedVehicle = await updateVehicleInDb(id, make, model, year, price, category, description);
    if (!updatedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }

    const imagePath = req.file ? `/images/vehicles/${req.file.filename}` : null;
    if (imagePath) {
        await updateVehicleImage(id, imagePath);
    }
   // res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
   res.redirect(`/vehicles/${updatedVehicle.id}`); // Redirect to the vehicle detail page after updating the vehicle
}

const deleteVehicleById = async (req, res) => {
    const { id } = req.params;
    const deletedVehicle = await deleteVehicleInDb(id);
    const deletedVehicleImage = await deleteVehicleImage(id);
    if (!deletedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }
    // res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
    res.redirect('/vehicles'); // Redirect to the vehicles list page after deleting the vehicle
}

const getAllVehiclesList = async (req, res) => {
    const vehicles = await getAllVehicles();
    const categories = await getAllCategories();
    res.render('vehicles', { title: 'Inventory', vehicles: vehicles, categories: categories });
}

router.get('/:id', getVehicle);
router.post('/', upload.single('image'), createNewVehicle);
router.put('/:id', upload.single('image'), updateVehicle);
router.delete('/:id', deleteVehicleById);
router.get('/', getAllVehiclesList);
router.post('/:vehicleId/reviews', async (req, res) => {
    const { vehicleId } = req.params;
    const { userId, rating, comment } = req.body;
    const newReview = await createReview(userId, vehicleId, rating, comment);
    res.redirect(`/vehicles/${vehicleId}`); // Redirect to the vehicle detail page after creating the review
    //res.status(201).json({ message: 'Review created successfully', review: newReview });
});

router.put('/:vehicleId/reviews/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const updatedReview = await updateReview(reviewId, rating, comment);
    res.redirect(`/vehicles/${req.params.vehicleId}`); // Redirect to the vehicle detail page after updating the review 

    //res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
});
/*
router.get('/:vehicleId/reviews', async (req, res) => {
    const { vehicleId } = req.params;
    const reviews = await getReviewsByVehicleId(vehicleId);
    res.status(200).json(reviews);
});*/

export default router;
