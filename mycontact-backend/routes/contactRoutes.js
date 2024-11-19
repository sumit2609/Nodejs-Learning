const express = require("express")
const router = express.Router();

const {
    getContacts,
    getContact,
    createContacts,
    deleteContact,
    updateContacts
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");

router.use(validateToken)
router.route("/").get(getContacts)

router.route("/:id").get(getContact)

router.route("/").post(createContacts)

router.route("/:id").put(updateContacts)

router.route("/:id").delete(deleteContact)

module.exports = router