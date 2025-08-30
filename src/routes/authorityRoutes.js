const express = require('express');
const router = express.Router();
const auth = require('../middleware/accesstoken');
const authorize = require('../middleware/authorization');
const validateRequest = require('../middleware/validateRequest');
const { 
    createAuthoritySchema, 
    updateAuthoritySchema 
} = require('../util/schemas/authoritySchema');
const authorityController = require('../controller/authority/authorityController');


// Apply authentication middleware to all routes
// router.use(auth);

// // Apply authorization middleware - only super_admin can access these routes
// router.use(authorize(['super_admin']));

// Create a new authority
router.post(
    '/',
    validateRequest(createAuthoritySchema),
    (req, res) => authorityController.createAuthority(req, res)
);

// Get all authorities
router.get('/', (req, res) => authorityController.getAllAuthorities(req, res));

// Get single authority by ID
router.get('/:id', (req, res) => authorityController.getAuthority(req, res));

// Update authority
router.put(
    '/:id',
    validateRequest(updateAuthoritySchema),
    (req, res) => authorityController.updateAuthority(req, res)
);

// Delete authority (soft delete)
router.delete('/:id', (req, res) => authorityController.deleteAuthority(req, res));

router.get('/feedback-list/:id', (req, res) => authorityController.feedbackList(req, res));

router.put('/feedback/update-status/:feedbackId', (req, res) => authorityController.updateFeedbackStatus(req, res));

router.post('/token/add', (req, res) => authorityController.addToken(req, res));
router.get('/token/all', (req, res) => authorityController.getAllToken(req, res));


module.exports = router;
