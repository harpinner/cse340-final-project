import { getServiceRequestById, createServiceRequest, updateServiceRequestStatus, deleteServiceRequest, getAllServiceRequests, getServiceRequestsByUserId } from "../models/servicerequests.js";
import { Router } from "express";
import { body, validationResult } from 'express-validator';

const router = Router();


const serviceRequestDetail = async (req, res) => {
    const { id } = req.params;
    const serviceRequest = await getServiceRequestById(id);
    if (!serviceRequest) {
        return res.status(404).json({ message: 'Service request not found' });
    }
    res.render('serviceRequestDetail', { title: 'Service Request Detail', serviceRequest: serviceRequest });
}







export default router;