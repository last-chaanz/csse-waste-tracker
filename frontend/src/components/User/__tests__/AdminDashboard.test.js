import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Import MemoryRouter
import AdminDashboard from '../AdminDashboard'; // Adjust the import path as necessary

// Mock user data
const mockUser = {
    email: 'admin@example.com',
    name:'Admin'
};

describe('AdminDashboard', () => {
    beforeEach(() => {
        // Render the component wrapped in MemoryRouter
        render(
            <MemoryRouter>
                <AdminDashboard user={mockUser} />
            </MemoryRouter>
        );
    });

    it('renders the Admin Dashboard with user email', () => {
        const emailElement = screen.getByText(/Email:/i);
        expect(emailElement).toBeInTheDocument();
        expect(emailElement).toHaveTextContent(`Email: ${mockUser.email}`);
        expect(emailElement).toHaveAttribute('data-id', 'admin-email');
    });
    it('renders the Admin Dashboard with user name', () => {
      const emailElement = screen.getByText(/Name:/i);
      expect(emailElement).toBeInTheDocument();
      expect(emailElement).toHaveTextContent(`Name: ${mockUser.name}`);
      expect(emailElement).toHaveAttribute('data-id', 'admin-name');
  });
});
