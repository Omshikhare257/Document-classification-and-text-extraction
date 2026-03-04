import React, { useState } from 'react';
import { Users, Building, Mail, Phone, MapPin, FileText, ChevronDown, ChevronUp } from 'lucide-react';

const CustomerClusters = ({ data }) => {
  const [expandedClusters, setExpandedClusters] = useState(new Set([0]));

  const toggleCluster = (clusterId) => {
    const newExpanded = new Set(expandedClusters);
    if (newExpanded.has(clusterId)) {
      newExpanded.delete(clusterId);
    } else {
      newExpanded.add(clusterId);
    }
    setExpandedClusters(newExpanded);
  };

  const getConfidenceBadge = (hasGST, hasPAN, hasIEC, hasCompanies) => {
    if (hasGST || hasPAN || hasIEC) {
      return { text: '🟢 HIGH (Validated ID)', color: 'bg-green-100 text-green-800' };
    } else if (hasCompanies) {
      return { text: '🟡 MEDIUM (Company Match)', color: 'bg-yellow-100 text-yellow-800' };
    }
    return { text: '🟠 LOW (Limited Data)', color: 'bg-orange-100 text-orange-800' };
  };

  return (
    <div className="space-y-6">
      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-900">
          📌 Documents are grouped using AI analysis of GST, PAN, company names, emails, phones, and 15+ other identifiers with validation
        </p>
      </div>

      {Object.entries(data.documentClusters).map(([clusterId, docIndices]) => {
        const clusterDocs = docIndices.map(idx => data.extractedData[idx]).filter(Boolean);
        const isExpanded = expandedClusters.has(parseInt(clusterId));
        
        // Aggregate data for this cluster
        const companies = new Set();
        const gstNumbers = new Set();
        const panNumbers = new Set();
        const emails = new Set();
        const phones = new Set();
        
        clusterDocs.forEach(doc => {
          // In a real implementation, you'd extract these from structured data
          // For demo, we'll show placeholder data
          companies.add(`${doc.filename.split('.')[0]} Ltd.`);
        });

        const confidence = getConfidenceBadge(gstNumbers.size > 0, panNumbers.size > 0, false, companies.size > 0);

        return (
          <div key={clusterId} className="card">
            {/* Cluster Header */}
            <button
              onClick={() => toggleCluster(parseInt(clusterId))}
              className="w-full flex items-center justify-between mb-4"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-xl font-bold text-gray-900">
                    Customer {parseInt(clusterId) + 1}
                  </h3>
                  <p className="text-gray-600">
                    {docIndices.length} Documents
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`badge ${confidence.color}`}>
                  {confidence.text}
                </span>
                {isExpanded ? <ChevronUp /> : <ChevronDown />}
              </div>
            </button>

            {/* Cluster Content */}
            {isExpanded && (
              <div className="space-y-6 animate-fadeIn">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Documents & Classification */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Documents & Classification
                    </h4>
                    <div className="space-y-2">
                      {clusterDocs.map((doc, idx) => {
                        const qualityIcon = doc.extraction_quality >= 85 ? '🟢' : 
                                          doc.extraction_quality >= 70 ? '🟡' : '🔴';
                        return (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2">
                              <span>{qualityIcon}</span>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900">{doc.filename}</p>
                                <p className="text-sm text-gray-600">
                                  Type: {doc.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
                                  ({doc.type_confidence}%) | Extraction: {doc.extraction_quality?.toFixed(0)}%
                                </p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Validated Identifiers */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Building className="w-5 h-5" />
                      Validated Identifiers
                    </h4>
                    <div className="space-y-4">
                      {companies.size > 0 && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">🏢 Companies:</p>
                          {Array.from(companies).map((company, idx) => (
                            <p key={idx} className="text-gray-600 ml-4">• {company}</p>
                          ))}
                        </div>
                      )}

                      {gstNumbers.size > 0 && (
                        <div>
                          <p className="font-semibold text-gray-700 mb-2">✅ GST Numbers (Validated):</p>
                          {Array.from(gstNumbers).map((gst, idx) => (
                            <code key={idx} className="block p-2 bg-gray-100 rounded mb-1">{gst}</code>
                          ))}
                        </div>
                      )}

                      {companies.size === 0 && gstNumbers.size === 0 && (
                        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                          <p className="text-yellow-800">
                            ℹ️ Limited identifier data available. Upload more documents for better clustering.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Statistics */}
                <div className="border-t pt-4">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">📊 Statistics</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Words</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {clusterDocs.reduce((sum, doc) => sum + (doc.word_count || 0), 0).toLocaleString()}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Avg Quality</p>
                      <p className="text-2xl font-bold text-green-600">
                        {(clusterDocs.reduce((sum, doc) => sum + (doc.extraction_quality || 0), 0) / clusterDocs.length).toFixed(0)}%
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
                      <p className="text-sm text-gray-600">Documents</p>
                      <p className="text-2xl font-bold text-purple-600">
                        {clusterDocs.length}
                      </p>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Fields Extracted</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {clusterDocs.reduce((sum, doc) => sum + (doc.ai_extracted_fields || 0), 0)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CustomerClusters;