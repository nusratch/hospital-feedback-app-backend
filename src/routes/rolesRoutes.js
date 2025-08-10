const express = require('express');
const router = express.Router();
const auth = require('../middleware/accesstoken');
const authorize = require('../middleware/authorization');


// Apply authentication middleware to all routes
// router.use(auth);

// // Apply authorization middleware - only super_admin can access these routes
// router.use(authorize(['super_admin']));

// // Create a new authority
// router.post(
//     '/',
//     validateRequest(createAuthoritySchema),
//     (req, res) => authorityController.createAuthority(req, res)
// );

// // Get all authorities
router.get('/', (req, res) => {
    const roles = [
        'medical_director',
        'nursing_head',
        'operations_manager',
        'housekeeping_manager',
        'pharmacy_head',
        'front_desk_manager',
        'facilities_manager',
        'finance_manager',
        'hospital_administrator',
        'super_admin'
    ];

    res.status(200).send(roles)

});

// // Get single authority by ID
// router.get('/:id', (req, res) => authorityController.getAuthority(req, res));

// // Update authority
// router.put(
//     '/:id',
//     validateRequest(updateAuthoritySchema),
//     (req, res) => authorityController.updateAuthority(req, res)
// );

// // Delete authority (soft delete)
// router.delete('/:id', (req, res) => authorityController.deleteAuthority(req, res));

module.exports = router;
