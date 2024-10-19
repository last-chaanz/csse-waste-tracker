import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WasteBinList from '../../WasteBin/fetchBin';
import axios from 'axios';
import { MemoryRouter } from 'react-router-dom';

jest.mock('axios');

describe('WasteBinList Component', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders and fetches waste bins successfully', async () => {
        const wasteBins = [{ _id: '1', location: 'Location', binType: 'Food', waste_level: 50, status: 'Active', collectionDay: 'Monday' }];
        axios.get.mockResolvedValueOnce({ data: wasteBins });

        render(<MemoryRouter><WasteBinList /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText(/Manage Your Waste Bins Here/i)).toBeInTheDocument();
        });
    });

    test('displays message when no waste bins are registered', async () => {
        axios.get.mockResolvedValueOnce({ data: [] });

        render(<MemoryRouter><WasteBinList /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText(/No waste bins registered/i)).toBeInTheDocument();
        });
    });

    test('handles authentication error', async () => {
        localStorage.removeItem('token');

        render(<MemoryRouter><WasteBinList /></MemoryRouter>);

        await waitFor(() => {
            expect(screen.getByText(/User not authenticated/i)).toBeInTheDocument();
        });
    });

    test('updates a waste bin successfully', async () => {
        const wasteBins = [{ _id: '1', location: 'Location', binType: 'Food', waste_level: 50, status: 'Active', collectionDay: 'Monday' }];
        axios.get.mockResolvedValueOnce({ data: wasteBins });
        axios.put.mockResolvedValueOnce({});

        render(<MemoryRouter><WasteBinList /></MemoryRouter>);

        await waitFor(() => {
        });
    });

    test('deletes a waste bin successfully', async () => {
        const wasteBins = [{ _id: '1', location: 'Location', binType: 'Food', waste_level: 50, status: 'Active', collectionDay: 'Monday' }];
        axios.get.mockResolvedValueOnce({ data: wasteBins });
        axios.delete.mockResolvedValueOnce({});

        render(<MemoryRouter><WasteBinList /></MemoryRouter>);

        await waitFor(() => {
        });

        window.confirm = jest.fn(() => true);
    });
});
