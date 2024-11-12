import React, { useState } from 'react';
import axios from 'axios';

const ProductManagement = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        quantity: ''
    });
    const [errors, setErrors] = useState({}); 

    // Handler for updating form state
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: '' })); // Clear any existing error for the changed field
    };

    // Validation logic for form fields
    const validateFields = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Product name is required";
        if (!formData.description) newErrors.description = "Description is required";
        if (!formData.category) newErrors.category = "Category is required";
        if (!formData.price || isNaN(formData.price)) newErrors.price = "A valid price is required";
        if (!formData.quantity || isNaN(formData.quantity)) newErrors.quantity = "A valid quantity is required";
        return newErrors;
    };

    // Handling the form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateFields();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return; // Halt if there are validation errors
        }

        try {
            // Send POST request to API
            const response = await axios.post('http://localhost:8081/api/MyProducts', {
                ...formData,
                price: parseFloat(formData.price), // Ensure price is a float
                quantity: parseInt(formData.quantity) // Ensure quantity is an integer
            });

            // Save the product to local storage
            const storedProducts = JSON.parse(localStorage.getItem("products")) || [];
            storedProducts.push({
                id: response.data.id, // Assuming the response returns the product ID
                name: response.data.name,
                quantity: parseInt(formData.quantity),
                description: formData.description,
                category: formData.category,
                price: parseFloat(formData.price),
            });
            localStorage.setItem("products", JSON.stringify(storedProducts));

            alert(`Product added successfully: ${response.data.name}`);
            setFormData({ name: '', description: '', category: '', price: '', quantity: '' }); // Reset form
        } catch (error) {
            console.error('Error adding product:', error);
            alert(`Error adding product: ${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <section>
            <h2>Product Management</h2>
            <form onSubmit={handleSubmit}>
                <InputField 
                    name="name" 
                    type="text" 
                    placeholder="Product Name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    error={errors.name} 
                />
                <InputField 
                    name="description" 
                    type="text" 
                    placeholder="Product Description" 
                    value={formData.description} 
                    onChange={handleChange} 
                    error={errors.description} 
                />
                <InputField 
                    name="category" 
                    type="text" 
                    placeholder="Product Category" 
                    value={formData.category} 
                    onChange={handleChange} 
                    error={errors.category} 
                />
                <InputField 
                    name="price" 
                    type="number" 
                    placeholder="Product Price" 
                    value={formData.price} 
                    onChange={handleChange} 
                    error={errors.price} 
                />
                <InputField 
                    name="quantity" 
                    type="number" 
                    placeholder="Product Quantity" 
                    value={formData.quantity} 
                    onChange={handleChange} 
                    error={errors.quantity} 
                />

                <button type="submit">Add Product</button>
            </form>
        </section>
    );
};

// A reusable input field component for cleaner code
const InputField = ({ name, type, placeholder, value, onChange, error }) => (
    <div>
        <input 
            type={type} 
            name={name} 
            placeholder={placeholder} 
            required 
            value={value} 
            onChange={onChange} 
        />
        {error && <span className="error-message">{error}</span>}
    </div>
);

export default ProductManagement;