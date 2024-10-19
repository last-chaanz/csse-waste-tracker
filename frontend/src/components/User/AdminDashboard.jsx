import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Table, notification, Menu, Avatar } from 'antd'; // Import Avatar
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginImage from '../../images/logoImage.jpeg';

// Sidebar component
const Sidebar = ({ user, onViewCollectors, onAddCollector, onProfileClick, onLogout }) => (
    <div className="sidebar rounded bg-white p-4 shadow-lg">
        <h2 className="mb-4 text-xl font-bold">Admin Dashboard</h2>
        <div className="mb-4 flex items-center">
            <Avatar src={user.avatar || 'defaultAvatar.png'} size={64} /> {/* Add Avatar */}
            <div className="ml-4">
                <p className="font-medium">{user.name}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
        </div>
        <Menu mode="inline">
            <Menu.Item key="view-collectors" onClick={onViewCollectors}>
                View Collectors
            </Menu.Item>
            <Menu.Item key="add-collector" onClick={onAddCollector}>
                Add Collector
            </Menu.Item>
            <Menu.Item key="profile" onClick={onProfileClick}>
                Update Profile
            </Menu.Item>
            <Menu.Item key="logout" danger onClick={onLogout}>
                Logout
            </Menu.Item>
        </Menu>
    </div>
);

// Header component
const Header = () => (
    <div className="header flex items-center justify-center bg-white p-4 shadow-md">
        <img src={LoginImage} alt="Clean Country Logo" className="mr-2 h-16 w-16 rounded" />
        <h1 className="text-2xl font-bold">Clean Country.LK</h1>
    </div>
);

// Footer component
const Footer = () => (
    <div className="footer mt-4 bg-gray-200 p-4 text-center">
        <p>&copy; 2024 Clean Country.LK. All rights reserved.</p>
    </div>
);

// Main AdminDashboard component
const AdminDashboard = () => {
    const [showAddCollectorModal, setShowAddCollectorModal] = useState(false);
    const [showUpdateCollectorModal, setShowUpdateCollectorModal] = useState(false);
    const [newCollector, setNewCollector] = useState({ name: '', email: '', address: '', password: '' });
    const [collectors, setCollectors] = useState([]);
    const [filteredCollectors, setFilteredCollectors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState({ email: 'admin@example.com', name: 'Admin', avatar: 'defaultAvatar.png' }); // Add avatar
    const [updatedUser, setUpdatedUser] = useState({ name: '', address: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [currentCollectorId, setCurrentCollectorId] = useState(null);
    const [collectorCount, setCollectorCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCollectors();
        fetchUser();
    }, []);

    useEffect(() => {
        const filtered = collectors.filter((collector) => collector.name.toLowerCase().includes(searchQuery.toLowerCase()));
        setFilteredCollectors(filtered);
        setCollectorCount(filtered.length);
    }, [searchQuery, collectors]);

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
            setFilteredCollectors(response.data);
            setCollectorCount(response.data.length);
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.msg || 'Failed to fetch collectors.',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        navigate('/');
    };

    const handleDeleteCollector = (id) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this collector?',
            content: 'This action cannot be undone.',
            onOk: async () => {
                try {
                    await axios.delete(`http://localhost:4000/api/auth/${id}`);
                    notification.success({ message: 'Success', description: 'Collector deleted successfully.' });
                    fetchCollectors();
                } catch (error) {
                    notification.error({
                        message: 'Error',
                        description: error.response?.data?.msg || 'Failed to delete collector.',
                    });
                }
            },
        });
    };

    const columns = [
        { title: 'Name', dataIndex: 'name' },
        { title: 'Email', dataIndex: 'email' },
        { title: 'Address', dataIndex: 'address' },
        {
            title: 'Actions',
            render: (_, record) => (
                <div>
                    <Button onClick={() => openUpdateModal(record)} style={{ marginRight: 8 }} type="primary">
                        Update
                    </Button>
                    <Button type="danger" onClick={() => handleDeleteCollector(record._id)}>
                        Delete
                    </Button>
                </div>
            ),
        },
    ];

    const openUpdateModal = (collector) => {
        setCurrentCollectorId(collector._id);
        setNewCollector({
            name: collector.name,
            email: collector.email,
            address: collector.address,
            password: '',
        });
        setShowUpdateCollectorModal(true);
    };

    const handleUpdateCollector = async () => {
        if (!currentCollectorId) {
            notification.error({ message: 'Error', description: 'Collector ID is missing' });
            return;
        }
        try {
            await axios.put(`http://localhost:4000/api/auth/${currentCollectorId}`, newCollector);
            notification.success({ message: 'Success', description: 'Collector updated successfully.' });
            setShowUpdateCollectorModal(false);
            fetchCollectors();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.msg || 'Failed to update collector.',
            });
        }
    };

    const handleAddNewCollector = async () => {
        try {
            await axios.post('http://localhost:4000/api/auth/register', {
                ...newCollector,
                userType: 'collector',
                role: 'collector',
            });
            notification.success({ message: 'Success', description: 'Collector added successfully.' });
            setShowAddCollectorModal(false);
            fetchCollectors();
        } catch (error) {
            notification.error({
                message: 'Error',
                description: error.response?.data?.msg || 'Failed to add collector.',
            });
        }
    };

    return (
        <div className="container mx-auto flex p-4">
            <Sidebar
                user={user}
                onViewCollectors={fetchCollectors}
                onAddCollector={() => setShowAddCollectorModal(true)}
                onProfileClick={() => {
                    /* Handle profile click */
                }}
                onLogout={handleLogout}
            />
            <div className="flex-grow p-4">
                <Header />
                <div className="mb-4 rounded-lg bg-white p-6 shadow-lg">
                    <h2 className="mb-4 text-center text-3xl font-extrabold text-blue-600">Manage Garbage Collectors</h2>
                    <h3 className="mb-4 text-center text-xl">Total Collectors: {collectorCount}</h3>
                    <Input
                        placeholder="Search collectors by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="mb-4"
                    />
                    <Table
                        loading={loading}
                        dataSource={filteredCollectors}
                        columns={columns}
                        rowKey="_id"
                        pagination={{ pageSize: 5 }}
                    />
                </div>
                <Footer />

                {/* Modal for adding new collector */}
                <Modal
                    title="Add New Collector"
                    visible={showAddCollectorModal}
                    onCancel={() => setShowAddCollectorModal(false)}
                    footer={[
                        <Button key="back" onClick={() => setShowAddCollectorModal(false)}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleAddNewCollector}>
                            Add Collector
                        </Button>,
                    ]}
                >
                    <Input
                        placeholder="Name"
                        value={newCollector.name}
                        onChange={(e) => setNewCollector({ ...newCollector, name: e.target.value })}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Email"
                        value={newCollector.email}
                        onChange={(e) => setNewCollector({ ...newCollector, email: e.target.value })}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Address"
                        value={newCollector.address}
                        onChange={(e) => setNewCollector({ ...newCollector, address: e.target.value })}
                        className="mb-4"
                    />
                    <Input.Password
                        placeholder="Password"
                        value={newCollector.password}
                        onChange={(e) => setNewCollector({ ...newCollector, password: e.target.value })}
                        className="mb-4"
                    />
                </Modal>

                {/* Modal for updating collector */}
                <Modal
                    title="Update Collector"
                    visible={showUpdateCollectorModal}
                    onCancel={() => setShowUpdateCollectorModal(false)}
                    footer={[
                        <Button key="back" onClick={() => setShowUpdateCollectorModal(false)}>
                            Cancel
                        </Button>,
                        <Button key="submit" type="primary" onClick={handleUpdateCollector}>
                            Update Collector
                        </Button>,
                    ]}
                >
                    <Input
                        placeholder="Name"
                        value={newCollector.name}
                        onChange={(e) => setNewCollector({ ...newCollector, name: e.target.value })}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Email"
                        value={newCollector.email}
                        onChange={(e) => setNewCollector({ ...newCollector, email: e.target.value })}
                        className="mb-4"
                    />
                    <Input
                        placeholder="Address"
                        value={newCollector.address}
                        onChange={(e) => setNewCollector({ ...newCollector, address: e.target.value })}
                        className="mb-4"
                    />
                    <Input.Password
                        placeholder="Password"
                        value={newCollector.password}
                        onChange={(e) => setNewCollector({ ...newCollector, password: e.target.value })}
                        className="mb-4"
                    />
                </Modal>
            </div>
        </div>
    );
};

export default AdminDashboard;
