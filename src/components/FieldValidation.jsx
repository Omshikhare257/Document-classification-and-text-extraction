import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const FieldValidation = ({ data }) => {
  // Mock validation data for demonstration
  const validationResults = {
    gst_number: {
      valid: [
        { value: '29AABCU9603R1ZM', source: 'invoice_001.pdf' },
        { value: '27AAPFU0939F1ZV', source: 'invoice_002.pdf' }
      ],
      invalid: [
        { value: '29ABC123', source: 'document_003.pdf' }
      ]
    },
    pan_number: {
      valid: [
        { value: 'AABCU9603R', source: 'invoice_001.pdf' }
      ],
      invalid: []
    },
    iec_number: {
      valid: [
        { value: '0123456789', source: 'export_doc.pdf' }
      ],
      invalid: []
    },
    container_number: {
      valid: [
        { value: 'MSCU1234567', source: 'bol_001.pdf' },
        { value: 'TCLU9876543', source: 'bol_002.pdf' }
      ],
      invalid: []
    },
    email_addresses: {
      valid: [
        { value: 'contact@company.com', source: 'invoice_001.pdf' },
        { value: 'export@trading.in', source: 'invoice_002.pdf' }
      ],
      invalid: [
        { value: 'invalid.email', source: 'document_003.pdf' }
      ]
    }
  };

  const getValidationIcon = (validCount, invalidCount) => {
    const total = validCount + invalidCount;
    const successRate = (validCount / total) * 100;
    
    if (successRate === 100) return { icon: <CheckCircle className="w-6 h-6 text-green-500" />, status: 'ALL VALID', color: 'bg-green-50 border-green-200 text-green-800' };
    if (successRate >= 80) return { icon: <AlertCircle className="w-6 h-6 text-yellow-500" />, status: 'MOSTLY VALID', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' };
    return { icon: <XCircle className="w-6 h-6 text-red-500" />, status: 'NEEDS REVIEW', color: 'bg-red-50 border-red-200 text-red-800' };
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900">
          ✅ Detailed validation status for all extracted fields with confidence scores
        </p>
      </div>

      {Object.entries(validationResults).map(([fieldName, validation]) => {
        const validCount = validation.valid.length;
        const invalidCount = validation.invalid.length;
        const total = validCount + invalidCount;

        if (total === 0) return null;

        const { icon, status, color } = getValidationIcon(validCount, invalidCount);
        const successRate = ((validCount / total) * 100).toFixed(0);

        return (
          <div key={fieldName} className="card">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                {icon}
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {validCount}/{total} valid entries ({successRate}% success rate)
                  </p>
                </div>
              </div>
              <span className={`badge ${color}`}>
                {status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Valid Entries */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Valid Entries
                </h4>
                {validation.valid.length > 0 ? (
                  <div className="space-y-2">
                    {validation.valid.map((entry, idx) => (
                      <div key={idx} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <code className="text-sm font-mono text-green-900 block mb-1">
                              {entry.value}
                            </code>
                            <p className="text-xs text-green-700">
                              Source: {entry.source}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-gray-500">
                    No valid entries found
                  </div>
                )}
              </div>

              {/* Invalid Entries */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-red-600" />
                  Invalid/Needs Review
                </h4>
                {validation.invalid.length > 0 ? (
                  <div className="space-y-2">
                    {validation.invalid.map((entry, idx) => (
                      <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-start gap-2">
                          <XCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <code className="text-sm font-mono text-red-900 block mb-1">
                              {entry.value}
                            </code>
                            <p className="text-xs text-red-700">
                              Source: {entry.source}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center text-green-700">
                    ✓ All entries are valid!
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="progress-bar">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500 transition-all duration-500"
                  style={{ width: `${successRate}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 text-center mt-2">
                Validation Success Rate: {successRate}%
              </p>
            </div>
          </div>
        );
      })}

      {/* Summary Card */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
        <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Validation Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {Object.values(validationResults).reduce((sum, v) => sum + v.valid.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Valid</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-red-600">
              {Object.values(validationResults).reduce((sum, v) => sum + v.invalid.length, 0)}
            </div>
            <div className="text-sm text-gray-600">Total Invalid</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {Object.keys(validationResults).length}
            </div>
            <div className="text-sm text-gray-600">Field Types</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {(() => {
                const totalValid = Object.values(validationResults).reduce((sum, v) => sum + v.valid.length, 0);
                const totalAll = Object.values(validationResults).reduce((sum, v) => sum + v.valid.length + v.invalid.length, 0);
                return ((totalValid / totalAll) * 100).toFixed(0);
              })()}%
            </div>
            <div className="text-sm text-gray-600">Overall Success</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldValidation;