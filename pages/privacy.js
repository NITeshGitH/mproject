import React from 'react';

const Privacy = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Information Collection</h2>
            <p className="text-gray-600">
              We collect information that you provide directly to us when using our services...
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Data Protection</h2>
            <p className="text-gray-600">
              We implement security measures to maintain the safety of your personal information...
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Privacy;