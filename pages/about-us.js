import React from 'react';

const AboutUs = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">About Us</h1>
        
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Our Mission</h2>
            <p className="text-gray-600">
              We are dedicated to revolutionizing supply chain management through blockchain technology,
              providing transparent and efficient solutions for businesses worldwide.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Our Vision</h2>
            <p className="text-gray-600">
              To become the leading platform for supply chain management, enabling businesses
              to operate with greater efficiency, transparency, and trust.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;