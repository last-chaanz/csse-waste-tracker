import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Table, notification, Dropdown, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DownOutlined } from '@ant-design/icons';

const AdminDashboard = () => {
    const [showAddCollectorModal, setShowAddCollectorModal] = useState(false);
    const [showUpdateCollectorModal, setShowUpdateCollectorModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [newCollector, setNewCollector] = useState({ name: '', email: '', password: '', address: '' ,role: 'collector', userType: 'collector'});
    const [collectors, setCollectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [id, setCurrentCollectorId] = useState(null);
    const [user, setUser] = useState({ 
        email: 'admin@example.com', 
        name: 'Admin', 
        profilePicture: 'https://via.placeholder.com/150'
    });
    const [updatedUser, setUpdatedUser] = useState({ name: '', address: '' });
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollectors();
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                notification.error({ message: 'Error', description: 'No token found. Please log in.' });
                return;
            }

            const response = await axios.get('http://localhost:4000/api/auth/user', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(response.data);
            setUpdatedUser({ name: response.data.name, address: response.data.address || '' });
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.msg || 'Failed to fetch user data.',
            });
        }
    };

    const fetchCollectors = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/auth/collectors');
            setCollectors(response.data);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.msg || 'Failed to fetch collectors.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleProfileClick = () => {
        setShowUpdateModal(true);
    };

    const handleUpdateUser = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(
                'http://localhost:4000/api/auth/user',
                {
                    name: updatedUser.name,
                    address: updatedUser.address,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            notification.success({ message: 'Success', description: 'User information updated successfully.' });
            setUser({ ...user, name: updatedUser.name, address: updatedUser.address });
            setShowUpdateModal(false);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.msg || 'Failed to update user information.',
            });
        }
    };

    const handleDeleteCollector = async (id) => {
        setCollectors((prevCollectors) => prevCollectors.filter((collector) => collector.id !== id));

        await axios
            .delete(`http://localhost:4000/api/auth/${id}`)
            .then((response) => {
                console.log('Collector deleted successfully', response);
                fetchCollectors();
            })
            .catch((error) => {
                console.error('Error deleting collector', error);
            });

        if (response.status === 200) {
            alert('Profile updated successfully!'); // Show success message
            setShowUpdateModal(false);
            fetchUser();
        } else {
            alert('Failed to update profile. Please try again.');
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const dropdownMenu = (
        <Menu>
            <Menu.Item key="profile" onClick={handleProfileClick}>
                Profile
            </Menu.Item>
            <Menu.Item key="deactivate" danger onClick={handleLogout}>
                Deactivate Account
            </Menu.Item>
        </Menu>
    );

    const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Address', dataIndex: 'address' },
        {
            title: 'Actions',
            render: (_, record) => (
                <>
                    <Button
                        onClick={() => openUpdateModal(record)}
                        style={{ marginRight: 8, backgroundColor: '#4CAF50', color: 'white' }}
                    >
                        Update
                    </Button>
                    <Button
                        type="danger"
                        onClick={() => handleDeleteCollector(record._id)}
                        style={{ backgroundColor: '#F44336', color: 'white' }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    const openUpdateModal = (collector) => {
        setCurrentCollectorId(collector._id);
        setNewCollector({
            name: collector.name,
            email: collector.email,
            address: collector.address,
            role: collector.role || 'collector', 
        });
        console.log(newCollector.role); // Check role value here
        setShowUpdateCollectorModal(true);
    };

    const handleAddCollector = async () => {
        try {
            console.log(newCollector);
            
            const response = await axios.post('http://localhost:4000/api/auth/register', newCollector);
            notification.success({ message: 'Success', description: 'Collector added successfully.' });
            setShowAddCollectorModal(false);
            fetchCollectors(); // Refresh collectors list
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.msg || 'Failed to add collector.',
            });
        }
    };

    const handleUpdateCollector = async () => {
        if (!id) {
            notification.error({
                message: 'Error',
                description: 'Collector ID is missing',
            });
            return;
        }
    
        try {
            const response = await axios.put(`http://localhost:4000/api/auth/${id}`, newCollector);
            notification.success({ message: 'Success', description: 'Collector updated successfully.' });
            
            setShowUpdateCollectorModal(false);
            fetchCollectors(); // Refresh collectors list
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.msg || 'Failed to update collector.',
            });
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="mb-4 text-center text-2xl font-bold">Admin Dashboard</h1>
            <div className="mb-4 flex items-center rounded-lg bg-white p-6 shadow-lg">
                {user && user.profilePicture && (
                    <img src={user.profilePicture} alt="Profile" className="mr-4 h-16 w-16 rounded-full" />
                )}
                <div className="flex-grow">
                    <p className="text-gray-700">Email: {user?.email}</p>
                    {user?.name && <p className="text-gray-700">Name: {user.name}</p>}
                </div>
                <Dropdown overlay={dropdownMenu} trigger={['click']} placement="bottomRight">
                    <Button type="link">
                        Options <DownOutlined />
                    </Button>
                </Dropdown>
                <Button type="danger" onClick={handleLogout} style={{ marginLeft: 16 }}>
                    Signout
                </Button>
            </div>

            {/* Manage Collectors */}
            <div className="mb-4 rounded-lg bg-white p-6 shadow-lg">
                <h2 className="mb-4 text-xl font-semibold">Manage Garbage Collectors</h2>
                <Button type="primary" onClick={() => setShowAddCollectorModal(true)}>
                    Add Collector
                </Button>
                <Table dataSource={collectors} columns={columns} loading={loading} rowKey="_id" style={{ marginTop: '16px' }} />
            </div>

            {/* Add Collector Modal */}
            <Modal
                title="Add New Collector"
                visible={showAddCollectorModal}
                onCancel={() => setShowAddCollectorModal(false)}
                footer={null}
            >
                <Input
                    placeholder="Name"
                    value={newCollector.name}
                    onChange={(e) => setNewCollector({ ...newCollector, name: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    placeholder="Email"
                    value={newCollector.email}
                    onChange={(e) => setNewCollector({ ...newCollector, email: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    placeholder="Password"
                    type="password"
                    value={newCollector.password}
                    onChange={(e) => setNewCollector({ ...newCollector, password: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    placeholder="Address"
                    value={newCollector.address}
                    onChange={(e) => setNewCollector({ ...newCollector, address: e.target.value })}
                    style={{ marginBottom: '20px' }}
                />
                <div className="flex justify-end">
                    <Button onClick={() => setShowAddCollectorModal(false)} className="mr-2">
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleAddCollector}>
                        Add Collector
                    </Button>
                </div>
            </Modal>

            {/* Update Collector Modal */}
            <Modal
                title="Update Collector"
                visible={showUpdateCollectorModal}
                onCancel={() => setShowUpdateCollectorModal(false)}
                footer={null}
            >
                <Input
                    placeholder="Name"
                    value={newCollector.name}
                    onChange={(e) => setNewCollector({ ...newCollector, name: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    placeholder="Email"
                    value={newCollector.email}
                    onChange={(e) => setNewCollector({ ...newCollector, email: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    placeholder="Address"
                    value={newCollector.address}
                    onChange={(e) => setNewCollector({ ...newCollector, address: e.target.value })}
                    style={{ marginBottom: '20px' }}
                />
                <div className="flex justify-end">
                    <Button onClick={() => setShowUpdateCollectorModal(false)} className="mr-2">
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleUpdateCollector}>
                        Update Collector
                    </Button>
                </div>
            </Modal>

            {/* Update Profile Modal */}
            <Modal title="Update Profile" visible={showUpdateModal} onCancel={() => setShowUpdateModal(false)} footer={null}>
                <Input
                    placeholder="Name"
                    value={updatedUser.name}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, name: e.target.value })}
                    style={{ marginBottom: '10px' }}
                />
                <Input
                    placeholder="Address"
                    value={updatedUser.address}
                    onChange={(e) => setUpdatedUser({ ...updatedUser, address: e.target.value })}
                    style={{ marginBottom: '20px' }}
                />
                <div className="flex justify-end">
                    <Button onClick={() => setShowUpdateModal(false)} className="mr-2">
                        Cancel
                    </Button>
                    <Button type="primary" onClick={handleUpdateUser}>
                        Update Profile
                    </Button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminDashboard;
