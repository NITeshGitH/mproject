import React from 'react';

const Service = () => {
  const services = [
    {
      title: "Package Tracking",
      description: "Real-time tracking of your shipments using blockchain technology"
    },
    {
      title: "Smart Contracts",
      description: "Automated and secure contract management"
    },
    {
      title: "Supply Chain Management",
      description: "End-to-end supply chain visibility and management"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Service;