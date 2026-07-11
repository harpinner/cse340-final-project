import { getServiceRequestById, createServiceRequest, updateServiceRequestStatus as updateServiceRequestStatusInDb, deleteServiceRequest as deleteServiceRequestInDb, getAllServiceRequests, getServiceRequestsByUserId } from "../models/servicerequests.js";
import { Router } from "express";
import { body, validationResult } from 'express-validator';

const router = Router();

const createNewServiceRequest = async (req, res) => {
    const { userId, vehicleId, serviceType, description } = req.body;
    const newServiceRequest = await createServiceRequest(userId, vehicleId, serviceType, description);
    //res.status(201).json(newServiceRequest);
};

const updateServiceRequestStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const updatedServiceRequest = await updateServiceRequestStatusInDb(id, status);
    if (!updatedServiceRequest) {
        return res.status(404).json({ message: 'Service request not found' });
    }
    //res.status(200).json(updatedServiceRequest);

    res.redirect(`/service-requests/`); // Redirect to the service request detail page after updating the status
};

const deleteServiceRequest = async (req, res) => {
    const { id } = req.params;
    const deletedServiceRequest = await deleteServiceRequestInDb(id);
    if (!deletedServiceRequest) {
        return res.status(404).json({ message: 'Service request not found' });
    }
    //res.status(200).json({ message: 'Service request deleted successfully' });
    res.redirect(`/service-requests/`); // Redirect to the service request list page after deleting the request
};

const serviceRequestDetail = async (req, res) => {
    const { id } = req.params;
    const serviceRequest = await getServiceRequestById(id);
    if (!serviceRequest) {
        return res.status(404).json({ message: 'Service request not found' });
    }
    res.render('serviceRequestDetail', { title: 'Service Request Detail', serviceRequest: serviceRequest });
}

const ServiceRequestList = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin' && req.session.user.role !== 'employee') {
        return res.status(403).send('Access denied. Admins only.');
    }
    const serviceRequests = await getAllServiceRequests();
    res.render('serviceRequests', { title: 'Service Requests', serviceRequests: serviceRequests });
}

const ServiceRequestListByUser = async (req, res) => {
    if (!req.session.user || req.session.user.role !== 'admin' && req.session.user.role !== 'employee') {
        return res.status(403).send('Access denied. Admins only.');
    }
    const { userId } = req.params;
    const serviceRequests = await getServiceRequestsByUserId(userId);
    res.render('serviceRequestList', { title: 'My Service Requests', serviceRequests: serviceRequests });
}

const ServiceRequestForm = (req, res) => {
    res.render('serviceRequestForm', { title: 'New Service Request' });
}


router.post('/', createNewServiceRequest);
router.put('/:id/', updateServiceRequestStatus);
router.delete('/:id', deleteServiceRequest);
router.get('/:id', serviceRequestDetail);
router.get('/', ServiceRequestList);
router.get('/user/:userId', ServiceRequestListByUser);
router.get('/new', ServiceRequestForm);






export default router;
