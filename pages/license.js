import React from 'react';

const License = () => {
  return (
    <div className="max-w-screen-xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">License Agreement</h1>
        
        <div className="space-y-4">
          <section>
            <h2 className="text-xl font-semibold mb-2">Software License</h2>
            <p className="text-gray-600">
              This software is provided under the following terms and conditions...
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-2">Usage Rights</h2>
            <p className="text-gray-600">
              The license grants you the right to use the software according to the specified terms...
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default License;