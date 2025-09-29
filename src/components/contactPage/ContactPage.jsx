import React, { useState } from 'react';
import Footer from '../Footer/Footer';
const LocationIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>;
const EmailIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>;


const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });

    const [statusMessage, setStatusMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // In a real application, you would send the form data to a backend server
        // or a third-party service like EmailJS or Formspree.
        console.log('Form submitted:', formData);

        // Simulate a successful submission
        setStatusMessage('Thank you for your message! We will get back to you soon.');
        
        // Clear the form
        setFormData({
            name: '',
            email: '',
            message: ''
        });
        
        // Hide the status message after a few seconds
        setTimeout(() => setStatusMessage(''), 5000);
    };

    return (
        <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                        Get in Touch
                    </h1>
                    <p className="mt-4 text-lg text-gray-600">
                        We'd love to hear from you! Please fill out the form below or contact us using the information provided.
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Contact Information */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
                        
                        <div className="space-y-6">
                            <div className="flex items-start space-x-4">
                                <div className="text-indigo-600 mt-1"><LocationIcon /></div>
                                <div>
                                    <h3 className="text-lg font-semibold">Our Address</h3>
                                    <p className="text-gray-600">123 Market Street, E-Commerce City, 12345</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="text-indigo-600 mt-1"><PhoneIcon /></div>
                                <div>
                                    <h3 className="text-lg font-semibold">Call Us</h3>
                                    <p className="text-gray-600">+91 (123) 456-7890</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="text-indigo-600 mt-1"><EmailIcon /></div>
                                <div>
                                    <h3 className="text-lg font-semibold">Email Us</h3>
                                    <p className="text-gray-600">support@yourecommerce.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="mt-8 border-t pt-6">
                            <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
                            <div className="flex space-x-4">
                                {/* Replace '#' with your actual social media links */}
                                <a href="#" className="text-gray-500 hover:text-indigo-600">Facebook</a>
                                <a href="#" className="text-gray-500 hover:text-indigo-600">Twitter</a>
                                <a href="#" className="text-gray-500 hover:text-indigo-600">Instagram</a>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold text-gray-800 mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    name="message"
                                    id="message"
                                    rows="5"
                                    required
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                        {statusMessage && (
                            <p className="mt-4 text-center text-green-600">{statusMessage}</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default ContactPage;