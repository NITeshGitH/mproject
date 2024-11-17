import React from 'react';

const Terms = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
        
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using this website, you accept and agree to be bound by the terms
              and provision of this agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">2. Use License</h2>
            <p className="text-gray-600">
              Permission is granted to temporarily download one copy of the materials for personal,
              non-commercial transitory viewing only.
            </p>
          </section>

          {/* Add more sections as needed */}
        </div>
      </div>
    </div>
  );
};

export default Terms;