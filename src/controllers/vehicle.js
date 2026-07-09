import { getVehicleById, createVehicle, updateVehicle, deleteVehicle, getAllVehicles, crea } from "../models/vehicles";
import { getReviewsByVehicleId, createReview, deleteReview, updateReview, getAllReviews} from "../models/reviews.js";
import { Router } from "express";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, 'public', 'images', 'vehicles');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
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
    const vehicleImage = await getVehicleImageByVehicleId(id);
    // res.status(200).json(vehicle);
    res.render('vehicleDetail', { title: 'Vehicle Detail', vehicle: vehicle, reviews: reviews, vehicleImage: vehicleImage });
}
    
const createNewVehicle = async (req, res) => {
    const { make, model, year, price} = req.body;

    const imagePath = req.file ? `/images/vehicles/${req.file.filename}` : null;


    const newVehicle = await createVehicle(make, model, year, price);
    if (imagePath) {
        await createVehicleImage(newVehicle.id, imagePath);
    }   
    //res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
    res.redirect(`/vehicles/${newVehicle.id}`); // Redirect to the vehicle detail page after creating the vehicle
}

const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { make, model, year, price } = req.body;
    const updatedVehicle = await updateVehicle(id, make, model, year, price);
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
    const deletedVehicle = await deleteVehicle(id);
    const deletedVehicleImage = await deleteVehicleImage(id);
    if (!deletedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }
    // res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
    res.redirect('/vehicles'); // Redirect to the vehicles list page after deleting the vehicle
}

const getAllVehiclesList = async (req, res) => {
    const vehicles = await getAllVehicles();
    res.status(200).json(vehicles);
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
    res.status(201).json({ message: 'Review created successfully', review: newReview });
});

router.put('/:vehicleId/reviews/:reviewId', async (req, res) => {
    const { reviewId } = req.params;
    const { rating, comment } = req.body;
    const updatedReview = await updateReview(reviewId, rating, comment);
    res.redirect(`/vehicles/${req.params.vehicleId}`); // Redirect to the vehicle detail page after updating the review 

    res.status(200).json({ message: 'Review updated successfully', review: updatedReview });
});
/*
router.get('/:vehicleId/reviews', async (req, res) => {
    const { vehicleId } = req.params;
    const reviews = await getReviewsByVehicleId(vehicleId);
    res.status(200).json(reviews);
});*/

export default router;