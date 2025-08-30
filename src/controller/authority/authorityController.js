const AuthorityService = require('../../service/authorityService');

class AuthorityController {
    constructor() {
        this.authorityService = new AuthorityService();
    }

    async createAuthority(req, res) {
        try {
            const authorityData = {
                ...req.body,
            };

            const result = await this.authorityService.createAuthority(authorityData);
            res.status(201).json(result);
        } catch (error) {
            const status = 500;
            res.status(status).json({
                success: false,
                message: error?.message || 'Internal server error'
            });
        }
    }

    async getAuthority(req, res) {
        try {
            const result = await this.authorityService.getAuthority(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            const status = error.httpCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getAllAuthorities(req, res) {
        try {
            const result = await this.authorityService.getAllAuthorities();
            res.status(200).json(result);
        } catch (error) {
            const status = error.httpCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async updateAuthority(req, res) {
        try {
            const updateData = {
                ...req.body,
            };
            const result = await this.authorityService.updateAuthority(req.params.id, updateData);
            res.status(200).json(result);
        } catch (error) {
            console.log(":::::::", error)
            const status = error || 500;
            res.status(status).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async deleteAuthority(req, res) {
        try {
            const result = await this.authorityService.deleteAuthority(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            const status = error.httpCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async feedbackList(req, res) {
        try {
            const result = await this.authorityService.feedbackList(req.params.id);
            res.status(200).json(result);
        } catch (error) {
            const status = error.httpCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async updateFeedbackStatus(req, res) {
        try {
            const updateData = {
                ...req.body,
            };
            const result = await this.authorityService.updateFeedbackStatus(req.params.feedbackId, updateData);
            res.status(200).json(result);
        } catch (error) {
            console.log("::::::::::error1", error)
            const status = error.httpCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async addToken(req, res) {
        try {
            const result = await this.authorityService.addToken(req.body.createdBy);
            res.status(200).json(result);
        } catch (error) {
            const status = error.httpCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }

    async getAllToken(req, res) {
        try {
            const result = await this.authorityService.getAllToken();
            res.status(200).json(result);
        } catch (error) {
            const status = error.httpCode || 500;
            res.status(status).json({
                success: false,
                message: error.message || 'Internal server error'
            });
        }
    }
}

const authorityController = new AuthorityController();
module.exports = authorityController;
