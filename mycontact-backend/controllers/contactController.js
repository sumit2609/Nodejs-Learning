const asyncHandler = require("express-async-handler")
const errorHandler = require("../middleware/errorHandler")
//contact models
const Contact = require("../models/contactModel")
//@desc GET Contacts
//@route GET /api/contacts
//@access private

const getContacts = asyncHandler(async (req,res)=>{
    const contact = await Contact.find({user_id:req.user.id})
    res.status(200).json(contact)
});

//@desc GET Contact
//@route GET /api/contacts/:id
//@access private

const getContact = asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    res.status(200).json(contact)
});

//@desc POST Contacts
//@route POST /api/contacts
//@access private

const createContacts = asyncHandler(async (req,res)=>{
    console.log("The request body is: ",req.body)
    const {name, email, phone} = req.body
    if(!name||!email||!phone){
        res.status(400)
        throw new Error("All fields are mandatory!")
    }
    //from create we can add multiple entry at
    //same time but from save we can add only single entry at 
    //a time.
    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id:req.user.id,
    })
    res.status(200).json(contact)
});

//@desc DELETE Contact
//@route DELETE /api/contacts/:id
//@access private

const deleteContact = asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        res.status(404)
        throw new Error("Contact not found")
    }
    //check if user created the contact is same as user
    //deleting the contact
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User don't have permission to delete other user contacts")
    }
    await Contact.deleteOne({_id: req.params.id})
    res.status(200).json({message:`Delete contact for ${req.params.id}`})
});

//@desc update Contacts
//@route POST /api/contacts/:id 
//@access private

const updateContacts = asyncHandler(async (req,res)=>{
    const contact = await Contact.findById(req.params.id)
    if(!contact){
        req.status(404)
        throw new Error("Contact not found")
    }
    //check if user created the contact is same as user
    //updating the contact
    if(contact.user_id.toString() !== req.user.id){
        res.status(403)
        throw new Error("User don't have permission to update other user contacts")
    }

    const updatedContact = await Contact.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true}
    )
    res.status(200).json(updatedContact)
});

module.exports = 
    {
        getContacts,
        getContact,
        createContacts,
        deleteContact,
        updateContacts
    }