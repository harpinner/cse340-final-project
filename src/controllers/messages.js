import {createContact, updateContact, deleteContact, getAllContacts, getContactById, getContactsByUserId} from "../models/contacts.js";
import { Router } from "express";
import { body, validationResult } from 'express-validator';
const router = Router();
//Large Motors — Contact Us
const getContactDetail = async (req, res) => {
    const { id } = req.params;
    const contact = await getContactById(id);
    res.json(contact);
};


const createNewContact = async (req, res) => {
    const { user_id, message } = req.body;
    const newContact = await createContact(user_id, message);
    res.status(201).json({ message: 'Contact created successfully', contact: newContact });
}

const updateContactDetail = async (req, res) => {
    const { id } = req.params;
    const { user_id, message } = req.body;
    const updatedContact = await updateContact(id, user_id, message);
    res.json({ message: 'Contact updated successfully', contact: updatedContact });
}

const deleteContactDetail = async (req, res) => {
    const { id } = req.params;
    const deletedContact = await deleteContact(id);
    res.json({ message: 'Contact deleted successfully', contact: deletedContact });
}

const getAllContactsList = async (req, res) => {
    const contacts = await getAllContacts();
   // res.json(contacts);
    res.render('contacts', { title: 'Contact Us', contacts: contacts });
}

const respondToContact = async (req, res) => {
    const { id } = req.params;
    const { responseMessage } = req.body;

    const contact = await getContactById(id);
    if (!contact) {
        return res.status(404).json({ message: 'Contact not found' });
    }

    responseMessage = contact.message + ' ' + responseMessage;
    simulateEmailSending(contact, responseMessage);
    res.redirect('/contacts');
}


function simulateEmailSending(contact, responseMessage) {
    console.log(`Sending email to user ${contact.user_id} regarding contact ${contact.id}: ${responseMessage}`);
}

router.get('/', getAllContactsList);
router.get('/:id', getContactDetail);
router.post('/', createNewContact);
router.put('/:id', updateContactDetail);
router.delete('/:id', deleteContactDetail);
router.post('/:id/respond', respondToContact);


export default router;