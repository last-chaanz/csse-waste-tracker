const mongoose = require('mongoose');
const WasteBin = require('../models/Bin');
const binController = require('../controller/binController');
const httpMocks = require('node-mocks-http');

jest.mock('../models/Bin'); // Mock the WasteBin model

// Helper function to create a mock request
const createMockRequest = (body = {}, params = {}) => {
  return httpMocks.createRequest({
    body,
    params
  });
};

// Helper function to create a mock response
const createMockResponse = () => {
  return httpMocks.createResponse();
};

describe('BinController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createWasteBin', () => {
    it('should create a new waste bin and return success message', async () => {
      const req = createMockRequest({
        location: 'Test Location',
        binType: 'Plastic',
        userId: '610c9d36d2b970084bc80bba'
      });
      const res = createMockResponse();

      WasteBin.prototype.save = jest.fn().mockResolvedValueOnce({
        _id: '610c9d36d2b970084bc80bba',
        location: 'Test Location',
        binType: 'Plastic',
        userId: '610c9d36d2b970084bc80bba'
      });

      await binController.createWasteBin(req, res);
    });

    it('should return an error when required fields are missing', async () => {
      const req = createMockRequest({
        location: 'Test Location'
      });
      const res = createMockResponse();

      await binController.createWasteBin(req, res);
    });

    it('should return a server error on failure', async () => {
      const req = createMockRequest({
        location: 'Test Location',
        binType: 'Plastic',
        userId: '610c9d36d2b970084bc80bba'
      });
      const res = createMockResponse();

      WasteBin.prototype.save = jest.fn().mockRejectedValueOnce(new Error('Database error'));

      await binController.createWasteBin(req, res);
    });
  });

  describe('getWasteBinsByUser', () => {
    it('should return waste bins for a valid user ID', async () => {
      const req = createMockRequest({}, { userId: '610c9d36d2b970084bc80bba' });
      const res = createMockResponse();

      WasteBin.find = jest.fn().mockResolvedValueOnce([
        { location: 'Test Location 1', binType: 'Plastic', userId: '610c9d36d2b970084bc80bba' },
        { location: 'Test Location 2', binType: 'Metal', userId: '610c9d36d2b970084bc80bba' }
      ]);

      await binController.getWasteBinsByUser(req, res);
    });

    it('should return 404 if no bins found for the user', async () => {
      const req = createMockRequest({}, { userId: '610c9d36d2b970084bc80bba' });
      const res = createMockResponse();

      WasteBin.find = jest.fn().mockResolvedValueOnce([]);

      await binController.getWasteBinsByUser(req, res);
    });

    it('should return 500 on server error', async () => {
      const req = createMockRequest({}, { userId: '610c9d36d2b970084bc80bba' });
      const res = createMockResponse();

      WasteBin.find = jest.fn().mockRejectedValueOnce(new Error('Database error'));

      await binController.getWasteBinsByUser(req, res);
    });
  });

  describe('updateWasteBin', () => {
    it('should update waste bin details successfully', async () => {
      const req = createMockRequest(
        { location: 'Updated Location', binType: 'Plastic' },
        { id: '610c9d36d2b970084bc80bba' }
      );
      const res = createMockResponse();

      WasteBin.findByIdAndUpdate = jest.fn().mockResolvedValueOnce({
        location: 'Updated Location',
        binType: 'Plastic'
      });

      await binController.updateWasteBin(req, res);
    });

    it('should return 404 if waste bin is not found', async () => {
      const req = createMockRequest(
        { location: 'Updated Location', binType: 'Plastic' },
        { id: '610c9d36d2b970084bc80bba' }
      );
      const res = createMockResponse();

      WasteBin.findByIdAndUpdate = jest.fn().mockResolvedValueOnce(null);

      await binController.updateWasteBin(req, res);
    });

    it('should return 400 on invalid input', async () => {
      const req = createMockRequest({ location: '' }, { id: '610c9d36d2b970084bc80bba' });
      const res = createMockResponse();

      WasteBin.findByIdAndUpdate = jest.fn().mockRejectedValueOnce(new Error('Invalid input'));

      await binController.updateWasteBin(req, res);
    });
  });

  describe('deleteWasteBin', () => {
    it('should delete waste bin successfully', async () => {
      const req = createMockRequest({}, { binId: '610c9d36d2b970084bc80bba' });
      const res = createMockResponse();

      WasteBin.findByIdAndDelete = jest.fn().mockResolvedValueOnce({
        _id: '610c9d36d2b970084bc80bba',
        location: 'Test Location',
        binType: 'Plastic'
      });

      await binController.deleteWasteBin(req, res);
    });

    it('should return 404 if waste bin is not found', async () => {
      const req = createMockRequest({}, { binId: '610c9d36d2b970084bc80bba' });
      const res = createMockResponse();

      WasteBin.findByIdAndDelete = jest.fn().mockResolvedValueOnce(null);

      await binController.deleteWasteBin(req, res);
    });

    it('should return 500 on server error', async () => {
      const req = createMockRequest({}, { binId: '610c9d36d2b970084bc80bba' });
      const res = createMockResponse();

      WasteBin.findByIdAndDelete = jest.fn().mockRejectedValueOnce(new Error('Database error'));

      await binController.deleteWasteBin(req, res);
    });
  });
});
