import { getVehicleById, createVehicle, updateVehicle, deleteVehicle, getAllVehicles } from "../models/vehicles";
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
    res.status(200).json(vehicle);
}
    
const createNewVehicle = async (req, res) => {
    const { make, model, year, price, } = req.body;




    const newVehicle = await createVehicle(make, model, year, price);
    res.status(201).json({ message: 'Vehicle created successfully', vehicle: newVehicle });
}

const updateVehicle = async (req, res) => {
    const { id } = req.params;
    const { make, model, year, price } = req.body;
    const updatedVehicle = await updateVehicle(id, make, model, year, price);
    if (!updatedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updatedVehicle });
}

const deleteVehicleById = async (req, res) => {
    const { id } = req.params;
    const deletedVehicle = await deleteVehicle(id);
    if (!deletedVehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted successfully', vehicle: deletedVehicle });
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

export default router;