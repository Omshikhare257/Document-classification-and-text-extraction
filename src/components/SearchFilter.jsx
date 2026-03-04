import React, { useState } from 'react';
import { Search, Filter, Download, ChevronDown, ChevronUp } from 'lucide-react';
import { saveAs } from 'file-saver';

const SearchFilter = ({ data }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState('contains');
  const [filterDocType, setFilterDocType] = useState('all');
  const [filterGST, setFilterGST] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [expandedResults, setExpandedResults] = useState(new Set());

  const toggleResult = (filename) => {
    const newExpanded = new Set(expandedResults);
    if (newExpanded.has(filename)) {
      newExpanded.delete(filename);
    } else {
      newExpanded.add(filename);
    }
    setExpandedResults(newExpanded);
  };

  // Search functionality
  const searchResults = searchTerm ? data.extractedData.filter(doc => {
    const text = doc.text || '';
    const term = searchTerm.toLowerCase();
    
    if (searchType === 'contains') {
      return text.toLowerCase().includes(term);
    } else if (searchType === 'exact') {
      return text.includes(searchTerm);
    } else if (searchType === 'regex') {
      try {
        const regex = new RegExp(searchTerm, 'gi');
        return regex.test(text);
      } catch {
        return false;
      }
    }
    return false;
  }) : [];

  // Filter functionality
  const filteredDocs = data.extractedData.filter(doc => {
    let match = true;

    // Document type filter
    if (filterDocType !== 'all' && doc.document_type !== filterDocType) {
      match = false;
    }

    // GST filter (mock - in real app would check structured data)
    if (filterGST && !doc.filename.toLowerCase().includes(filterGST.toLowerCase())) {
      match = false;
    }

    // Company filter
    if (filterCompany && !doc.filename.toLowerCase().includes(filterCompany.toLowerCase())) {
      match = false;
    }

    return match;
  });

  // Get unique document types
  const documentTypes = ['all', ...new Set(data.extractedData.map(d => d.document_type))];

  const downloadSearchResults = () => {
    let content = `Search Results for "${searchTerm}"\n`;
    content += `${'═'.repeat(80)}\n\n`;
    content += `Found in ${searchResults.length} documents\n\n`;

    searchResults.forEach((doc, idx) => {
      content += `\n${idx + 1}. ${doc.filename}\n`;
      content += `${'─'.repeat(80)}\n`;
      content += `${doc.text}\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `search_results_${Date.now()}.txt`);
  };

  const countMatches = (text, term) => {
    if (!text || !term) return 0;
    const regex = new RegExp(term, 'gi');
    const matches = text.match(regex);
    return matches ? matches.length : 0;
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Search className="w-6 h-6" />
          Search Across All Documents
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="md:col-span-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Enter GST number, invoice number, company name, etc."
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <select
              value={searchType}
              onChange={(e) => setSearchType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="contains">Contains</option>
              <option value="exact">Exact Match</option>
              <option value="regex">Regex</option>
            </select>
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="animate-fadeIn">
            {searchResults.length > 0 ? (
              <>
                <div className="flex items-center justify-between mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">{searchResults.length}</span>
                    </div>
                    <p className="font-semibold text-green-900">
                      Found <strong>{searchResults.length}</strong> documents containing "{searchTerm}"
                    </p>
                  </div>
                  <button onClick={downloadSearchResults} className="btn-secondary">
                    <Download className="w-4 h-4" />
                    Download Results
                  </button>
                </div>

                <div className="space-y-3">
                  {searchResults.map((doc, idx) => {
                    const isExpanded = expandedResults.has(doc.filename);
                    const matchCount = countMatches(doc.text, searchTerm);

                    return (
                      <div key={idx} className="border border-gray-200 rounded-lg overflow-hidden">
                        <button
                          onClick={() => toggleResult(doc.filename)}
                          className="w-full p-4 bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-between hover:from-blue-100 hover:to-purple-100 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">{idx + 1}</span>
                            </div>
                            <div className="text-left">
                              <h4 className="font-semibold text-gray-900">{doc.filename}</h4>
                              <div className="flex gap-4 text-sm text-gray-600 mt-1">
                                <span>{matchCount} matches</span>
                                <span>•</span>
                                <span>{doc.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                                <span>•</span>
                                <span>Quality: {doc.extraction_quality?.toFixed(0)}%</span>
                              </div>
                            </div>
                          </div>
                          {isExpanded ? <ChevronUp className="text-gray-600" /> : <ChevronDown className="text-gray-600" />}
                        </button>

                        {isExpanded && (
                          <div className="p-4 bg-white border-t animate-fadeIn">
                            <div className="bg-gray-50 p-4 rounded-lg max-h-64 overflow-y-auto">
                              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                                {doc.text}
                              </pre>
                            </div>
                            <div className="mt-3 flex gap-2">
                              <button
                                onClick={() => {
                                  const blob = new Blob([doc.text], { type: 'text/plain;charset=utf-8' });
                                  saveAs(blob, `${doc.filename}_extracted.txt`);
                                }}
                                className="btn-secondary"
                              >
                                <Download className="w-4 h-4" />
                                Download Document
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-900 font-semibold">
                  ⚠️ No documents found containing "{searchTerm}"
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  Try a different search term or use filters below
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Filter Section */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Filter className="w-6 h-6" />
          Filter by Validated Fields
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by GST Number
            </label>
            <input
              type="text"
              value={filterGST}
              onChange={(e) => setFilterGST(e.target.value)}
              placeholder="Enter GST number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Company Name
            </label>
            <input
              type="text"
              value={filterCompany}
              onChange={(e) => setFilterCompany(e.target.value)}
              placeholder="Enter company name"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Document Type
            </label>
            <select
              value={filterDocType}
              onChange={(e) => setFilterDocType(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {documentTypes.map(type => (
                <option key={type} value={type}>
                  {type === 'all' ? 'All Types' : type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Results */}
        {(filterGST || filterCompany || filterDocType !== 'all') && (
          <div className="animate-fadeIn">
            {filteredDocs.length > 0 ? (
              <>
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="font-semibold text-green-900">
                    ✅ Found <strong>{filteredDocs.length}</strong> matching documents
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocs.map((doc, idx) => (
                    <div key={idx} className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">{idx + 1}</span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{doc.filename}</h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {doc.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </p>
                          <p className="text-sm text-gray-600">
                            Confidence: {doc.type_confidence}%
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="p-2 bg-white rounded">
                          <p className="text-gray-600">Quality</p>
                          <p className="font-bold text-blue-600">{doc.extraction_quality?.toFixed(0)}%</p>
                        </div>
                        <div className="p-2 bg-white rounded">
                          <p className="text-gray-600">Fields</p>
                          <p className="font-bold text-purple-600">{doc.ai_extracted_fields}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="p-8 bg-yellow-50 border border-yellow-200 rounded-lg text-center">
                <p className="text-yellow-900 font-semibold">
                  ⚠️ No documents match the filter criteria
                </p>
                <p className="text-yellow-700 text-sm mt-2">
                  Try adjusting your filters
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchFilter;