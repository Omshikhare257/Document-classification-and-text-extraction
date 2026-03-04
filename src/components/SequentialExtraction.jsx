import React, { useState } from 'react';
import { FileText, ChevronDown, ChevronUp } from 'lucide-react';

const SequentialExtraction = ({ data }) => {
  const [selectedDoc, setSelectedDoc] = useState(data.extractedData[0]?.filename || '');
  const [expandedSections, setExpandedSections] = useState(new Set([0]));

  const toggleSection = (sectionIdx) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionIdx)) {
      newExpanded.delete(sectionIdx);
    } else {
      newExpanded.add(sectionIdx);
    }
    setExpandedSections(newExpanded);
  };

  const selectedDocData = data.extractedData.find(doc => doc.filename === selectedDoc);

  // Mock sequential data for demonstration
  const mockSequentialData = [
    {
      section: 'Invoice Header',
      items: [
        {
          line_number: 1,
          original_text: 'COMMERCIAL INVOICE NO: INV-2024-001',
          extracted: {
            document_type: 'Commercial Invoice',
            invoice_number: 'INV-2024-001'
          }
        },
        {
          line_number: 2,
          original_text: 'Date: 15/01/2024',
          extracted: {
            date: '15/01/2024'
          }
        }
      ]
    },
    {
      section: 'Exporter Details',
      items: [
        {
          line_number: 5,
          original_text: 'ABC EXPORTS PVT LTD',
          extracted: {
            company_name: 'ABC EXPORTS PVT LTD'
          }
        },
        {
          line_number: 6,
          original_text: 'GST: 29AABCU9603R1ZM',
          extracted: {
            gst_number: '29AABCU9603R1ZM'
          }
        }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900">
          💡 View extracted data in the exact order it appears in your documents - Perfect for verification and compliance checks
        </p>
      </div>

      {/* Document Selector */}
      <div className="card">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          🗂️ Select Document to View Sequential Extraction:
        </label>
        <select
          value={selectedDoc}
          onChange={(e) => setSelectedDoc(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {data.extractedData.map((doc, idx) => (
            <option key={idx} value={doc.filename}>
              {doc.filename}
            </option>
          ))}
        </select>
      </div>

      {/* Document Metrics */}
      {selectedDocData && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeIn">
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Document Type</p>
            <p className="text-lg font-bold text-blue-600">
              {selectedDocData.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Type Confidence</p>
            <p className="text-lg font-bold text-green-600">
              {selectedDocData.type_confidence}%
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Extraction Quality</p>
            <p className="text-lg font-bold text-purple-600">
              {selectedDocData.extraction_quality?.toFixed(0)}%
            </p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-600 mb-1">Fields Extracted</p>
            <p className="text-lg font-bold text-orange-600">
              {selectedDocData.ai_extracted_fields}
            </p>
          </div>
        </div>
      )}

      {/* Sequential Data Display */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          📄 Document Structure (Sequential Order)
        </h3>

        {mockSequentialData.map((section, sectionIdx) => {
          const isExpanded = expandedSections.has(sectionIdx);
          
          return (
            <div key={sectionIdx} className="mb-4 border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection(sectionIdx)}
                className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-between hover:from-blue-100 hover:to-purple-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <div className="text-left">
                    <h4 className="font-semibold text-gray-900">{section.section}</h4>
                    <p className="text-sm text-gray-600">{section.items.length} items</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
              </button>

              {isExpanded && (
                <div className="p-4 space-y-4 animate-fadeIn">
                  {section.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="border-l-4 border-blue-500 pl-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Line {item.line_number}</p>
                          <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                            {item.original_text}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Extracted Data</p>
                          <div className="space-y-1">
                            {Object.entries(item.extracted).map(([field, value]) => (
                              <div key={field} className="text-sm">
                                <span className="font-semibold text-blue-600">
                                  {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                                </span>{' '}
                                <code className="bg-blue-50 px-2 py-1 rounded">{value}</code>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full Text View */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🔍 Full Extracted Text
        </h3>
        <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
          <pre className="text-sm text-gray-700 whitespace-pre-wrap">
            {selectedDocData?.text || 'No text available'}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default SequentialExtraction;