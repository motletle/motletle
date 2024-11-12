import React, { useEffect, useState } from 'react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

const Dashboard = () => {
    const [products, setProducts] = useState([]);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
        setProducts(storedProducts);

        const storedTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
        setTransactions(storedTransactions);
    }, []);

    const calculateSoldStock = (product) => {
        return product.quantity < 20 ? 20 - product.quantity : 0;
    };

    const calculateTotalStockValue = () => {
        return products.reduce((total, product) => total + (product.price * product.quantity), 0).toFixed(2);
    };

    // Function to handle transaction deletion with confirmation
    const handleDeleteTransaction = (index) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this transaction?");
        if (confirmDelete) {
            const newTransactions = transactions.filter((_, i) => i !== index);
            setTransactions(newTransactions);
            localStorage.setItem("transactions", JSON.stringify(newTransactions)); // Update local storage
        }
    };

    // Function to handle product deletion with confirmation
    const handleDeleteProduct = (productId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this product?");
        if (confirmDelete) {
            const newProducts = products.filter(product => product.id !== productId);
            setProducts(newProducts);
            localStorage.setItem("products", JSON.stringify(newProducts)); // Update local storage
        }
    };

    return (
        <section className="container">
            <h2>Dashboard</h2>
            <h3>Total Stock Value: M{calculateTotalStockValue()}</h3>

            <div className="chart-container">
                <h3>Product Quantity Overview</h3>
                {products.length > 0 ? (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={products} barSize={50}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" stroke="#666" />
                            <YAxis stroke="#666" />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="quantity" fill="#007bff" />
                        </BarChart>
                    </ResponsiveContainer>
                ) : (
                    <div>No data available to display</div>
                )}
            </div>
            <div className="moving-images" style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <img src="wingsjpg.jpg" alt="Moving Image 1" width="80" height="80" />
                <img src="mine.jpg" alt="Moving Image 2" width="80" height="80" />
                <img src="nice.jpg" alt="Moving Image 3" width="80" height="80" />
            </div>
            <h3>Product Inventory</h3>
            <table>
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Stock Level</th>
                        <th>Sold Stock</th>
                        <th>Sold Products</th>
                        <th>Actions</th> {/* Added actions column */}
                    </tr>
                </thead>
                <tbody>
                    {products.length > 0 ? (
                        products.map((product) => (
                            <tr key={product.id}>
                                <td>{product.name}</td>
                                <td>{product.quantity}</td>
                                <td>M{product.price.toFixed(2)}</td>
                                <td>{product.quantity < 5 ? "Low Stock" : "Available"}</td>
                                <td>{calculateSoldStock(product)}</td>
                                <td>{calculateSoldStock(product) > 0 ? "Yes" : "No"}</td>
                                <td>
                                    <button onClick={() => handleDeleteProduct(product.id)}>Delete</button> {/* Delete button */}
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={7}>No Products Available</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <h3>Transaction History</h3>
            <table>
                <thead>
                    <tr>
                        <th>Stock Name</th>
                        <th>Quantity Changed</th>
                        <th>Action</th>
                        <th>Date & Time</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.length > 0 ? (
                        transactions.map((transaction, index) => (
                            <tr key={index}>
                                <td>{transaction.productName}</td>
                                <td>{transaction.quantityChanged}</td>
                                <td>{transaction.action === 'add' ? "Added" : "Deducted"}</td>
                                <td>{transaction.date}</td>
                                <td>
                                    <button onClick={() => handleDeleteTransaction(index)}>Delete</button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5}>No Transactions Available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </section>
    );
};

export default Dashboard;
