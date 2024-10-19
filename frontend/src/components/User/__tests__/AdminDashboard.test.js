import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AdminDashboard from '../AdminDashboard'; // Adjust the import path as necessary
import axios from 'axios';
import '@testing-library/jest-dom';

jest.mock('axios');

// Mock user data
const mockUser = {
    email: 'admin@example.com',
    name: 'Admin',
    avatar: 'defaultAvatar.png',
};

// Mock collectors data
const mockCollectors = [
    { _id: '1', name: 'Collector One', email: 'collector1@example.com', address: 'Address One' },
    { _id: '2', name: 'Collector Two', email: 'collector2@example.com', address: 'Address Two' },
];

describe('AdminDashboard', () => {
    beforeEach(async () => {
        axios.get.mockResolvedValueOnce({ data: mockCollectors });
        render(
            <MemoryRouter>
                <AdminDashboard />
            </MemoryRouter>
        );
    });

    it('renders the Admin Dashboard with the sidebar and table', async () => {
        const sidebarTitle = screen.getByText(/Admin Dashboard/i);
        expect(sidebarTitle).toBeInTheDocument();

        const totalCollectorsElement = await screen.findByText(/Total Collectors:/i);
        expect(totalCollectorsElement).toBeInTheDocument();
    });

    it('opens the "Add Collector" modal when the Add Collector button is clicked', () => {
        const addCollectorButton = screen.getByText(/Add Collector/i);
        fireEvent.click(addCollectorButton);

        const addModalTitle = screen.getByText(/Add New Collector/i);
        expect(addModalTitle).toBeInTheDocument();
    });

    it('handles input changes in the Add Collector modal', () => {
        const addCollectorButton = screen.getByText(/Add Collector/i);
        fireEvent.click(addCollectorButton);

        const nameInput = screen.getByPlaceholderText('Name');
        const emailInput = screen.getByPlaceholderText('Email');
        const addressInput = screen.getByPlaceholderText('Address');
        const passwordInput = screen.getByPlaceholderText('Password');

        fireEvent.change(nameInput, { target: { value: 'New Collector' } });
        fireEvent.change(emailInput, { target: { value: 'newcollector@example.com' } });
        fireEvent.change(addressInput, { target: { value: 'New Address' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });

        expect(nameInput.value).toBe('New Collector');
        expect(emailInput.value).toBe('newcollector@example.com');
        expect(addressInput.value).toBe('New Address');
        expect(passwordInput.value).toBe('password123');
    });

    it('displays the correct number of collectors', async () => {
        const collectorCountElement = await screen.findByText(/Total Collectors:/i);
        expect(collectorCountElement).toHaveTextContent(`Total Collectors: ${mockCollectors.length}`);
    });

    it('logs out the user when the logout button is clicked', () => {
        const logoutButton = screen.getByText(/Logout/i);
        fireEvent.click(logoutButton);

        // Check if the user is redirected to the login page (assuming navigate('/') is called)
        expect(window.location.pathname).toBe('/');
    });
});
