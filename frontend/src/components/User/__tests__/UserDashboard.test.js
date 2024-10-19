// UpdateUserModal.test.js
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { UpdateUserModal } from '../UserDashboard';

describe('UpdateUserModal', () => {
    const user = { name: 'John Doe', address: '123 Main St' };
    const onUpdate = jest.fn();
    const onClose = jest.fn();

    it('renders correctly when open', () => {
        const { getByLabelText, getByText } = render(
            <UpdateUserModal isOpen={true} user={user} onClose={onClose} onUpdate={onUpdate} />
        );
        expect(getByLabelText(/name/i)).toBeInTheDocument();
        expect(getByLabelText(/address/i)).toBeInTheDocument();
        expect(getByText(/update user information/i)).toBeInTheDocument();
    });


    it('calls onClose when the cancel button is clicked', () => {
        const { getByText } = render(
            <UpdateUserModal isOpen={true} user={user} onClose={onClose} onUpdate={onUpdate} />
        );

        fireEvent.click(getByText(/Cancel/i));
        expect(onClose).toHaveBeenCalled();
    });

    it('does not render when isOpen is false', () => {
        const { queryByText } = render(
            <UpdateUserModal isOpen={false} user={user} onClose={onClose} onUpdate={onUpdate} />
        );
        expect(queryByText(/update user information/i)).not.toBeInTheDocument();
    });
});
