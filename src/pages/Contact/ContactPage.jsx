import React, { useState } from "react";
import Footer from "../../components/Footer";

// --- Icon Components (No changes needed) ---
const LocationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);
const EmailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const ClockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-6 w-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState({ message: "", type: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ message: "", type: "" });

    // Simulate API call
    console.log("Form submitted:", formData);
    setTimeout(() => {
      setStatus({
        message: "Thank you for your message! We will get back to you soon.",
        type: "success",
      });
      setFormData({ name: "", email: "", message: "" });
      setIsSubmitting(false);
      setTimeout(() => setStatus({ message: "", type: "" }), 6000);
    }, 1500);
  };

  return (
    <div className="bg-gray-50">
      <div
        className="max-w-6xl mx-auto py-12 px-4
             sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Contact Our Team
          </h1>
          <p className="mt-3 text-base text-gray-600 max-w-xl mx-auto">
            We're here to help and answer any question you might have. We look
            forward to hearing from you.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Information & Hours */}
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-5">
              Contact Information
            </h2>

            <div className="space-y-5">
              {/* Address */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-indigo-600 mt-1">
                  <LocationIcon />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    Our Address
                  </h3>
                  <p className="text-gray-600 text-sm">kinfra </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-indigo-600 mt-1">
                  <PhoneIcon />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    Call Us
                  </h3>
                  <p className="text-gray-600 text-sm">+91 9946051136</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 text-indigo-600 mt-1">
                  <EmailIcon />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    Email Us
                  </h3>
                  <p className="text-gray-600 text-sm">mkmanjal@gmail.com</p>
                </div>
              </div>

              {/* Business Hours */}
              <div className="flex items-start space-x-3 border-t border-gray-200 pt-5 mt-5">
                <div className="flex-shrink-0 text-indigo-600 mt-1">
                  <ClockIcon />
                </div>
                <div>
                  <h3 className="text-md font-semibold text-gray-800">
                    Business Hours
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Monday - Friday: 9am to 5pm
                  </p>
                  <p className="text-gray-600 text-sm">
                    Saturday & Sunday: Closed
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form & Map Column */}
          <div className="space-y-8">
            {/* Contact Form */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-5">
                Send a Message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message
                  </label>
                  <textarea
                    name="message"
                    id="message"
                    rows="4"
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  ></textarea>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2 px-4 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 transition-colors"
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </div>
              </form>
              {status.message && (
                <div
                  className={`mt-4 text-center p-3 rounded-lg text-sm ${
                    status.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {status.message}
                </div>
              )}
            </div>

            {/* Map Section */}
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold text-gray-800 mb-5 text-center">
                Our Location
              </h2>
              <div className="rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3914.821949163691!2d75.92984181534424!3d11.1271224922119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba64b6c3f3f3f3f%3A0x3f3f3f3f3f3f3f3f!2sThenhipalam%2C%20Kerala!5e0!3m2!1sen!2sin!4v1678886456789!5m2!1sen!2sin"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Google Map of our location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
