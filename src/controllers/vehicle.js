import { getVehicleById, createVehicle, updateVehicle, deleteVehicle, getAllVehicles } from "../models/vehicles";


const getVehicle = async (req, res) => {
    const { id } = req.params;
    const vehicle = await getVehicleById(id);
    if (!vehicle) {
        return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json(vehicle);
}

const createNewVehicle = async (req, res) => {
    const { make, model, year, price } = req.body;
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