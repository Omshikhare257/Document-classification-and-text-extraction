import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/Navbar';
import DocumentUploader from './components/DocumentUploader';
import CustomerClusters from './components/CustomerClusters';
import SequentialExtraction from './components/SequentialExtraction';
import ProfessionalReports from './components/ProfessionalReports';
import FieldValidation from './components/FieldValidation';
import Analytics from './components/Analytics';
import Downloads from './components/Downloads';
import SearchFilter from './components/SearchFilter';
import './App.css';

function App() {
  const [analysisData, setAnalysisData] = useState({
    extractedData: [],
    individualTexts: {},
    structuredData: {},
    documentClusters: {},
    isProcessed: false
  });

  const [activeTab, setActiveTab] = useState('upload');

  const handleAnalysisComplete = (data) => {
    setAnalysisData({
      ...data,
      isProcessed: true
    });
    setActiveTab('clusters');
  };

  return (
    <Router>
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Navbar />

        {/* Hero Header */}
        <div style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #faf5ff 100%)', padding: '2rem 0' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
            <div className="text-center">
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                color: '#111827', 
                marginBottom: '1rem'
              }}>
                🚀 ULTRA-ACCURATE CUSTOMS DOCUMENT ANALYZER
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '0.5rem' }}>
                99.9% Extraction Accuracy | AI-Powered Sequential Analysis
              </p>
              <p style={{ color: '#6b7280' }}>
                Perfect for Customs Clearance | GST | IEC | Bill of Lading | Invoices
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1rem' }}>
          {/* Upload Section */}
          {!analysisData.isProcessed && (
            <DocumentUploader onAnalysisComplete={handleAnalysisComplete} />
          )}

          {/* Results Section */}
          {analysisData.isProcessed && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fadeIn">
                <div className="card">
                  <div className="text-center">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>
                      {Object.keys(analysisData.documentClusters).length}
                    </div>
                    <div style={{ color: '#6b7280' }}>Total Customers</div>
                  </div>
                </div>
                <div className="card">
                  <div className="text-center">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#9333ea', marginBottom: '0.5rem' }}>
                      {analysisData.extractedData.length}
                    </div>
                    <div style={{ color: '#6b7280' }}>Total Documents</div>
                  </div>
                </div>
                <div className="card">
                  <div className="text-center">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#16a34a', marginBottom: '0.5rem' }}>
                      {(analysisData.extractedData.reduce((sum, d) => sum + (d.extraction_quality || 0), 0) / analysisData.extractedData.length).toFixed(1)}%
                    </div>
                    <div style={{ color: '#6b7280' }}>Avg Extraction</div>
                  </div>
                </div>
                <div className="card">
                  <div className="text-center">
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#ea580c', marginBottom: '0.5rem' }}>
                      {analysisData.extractedData.filter(d => d.extraction_quality >= 85).length}/{analysisData.extractedData.length}
                    </div>
                    <div style={{ color: '#6b7280' }}>Validated Docs</div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div className="card">
                <div className="tabs">
                  <button 
                    className={`tab ${activeTab === 'clusters' ? 'active' : ''}`}
                    onClick={() => setActiveTab('clusters')}
                  >
                    👥 Customer Clusters
                  </button>
                  <button 
                    className={`tab ${activeTab === 'sequential' ? 'active' : ''}`}
                    onClick={() => setActiveTab('sequential')}
                  >
                    📋 Sequential Extraction
                  </button>
                  <button 
                    className={`tab ${activeTab === 'reports' ? 'active' : ''}`}
                    onClick={() => setActiveTab('reports')}
                  >
                    📄 Professional Reports
                  </button>
                  <button 
                    className={`tab ${activeTab === 'validation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('validation')}
                  >
                    🔍 Field Validation
                  </button>
                  <button 
                    className={`tab ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                  >
                    📊 Analytics
                  </button>
                  <button 
                    className={`tab ${activeTab === 'downloads' ? 'active' : ''}`}
                    onClick={() => setActiveTab('downloads')}
                  >
                    ⬇️ Downloads
                  </button>
                  <button 
                    className={`tab ${activeTab === 'search' ? 'active' : ''}`}
                    onClick={() => setActiveTab('search')}
                  >
                    🔎 Search
                  </button>
                </div>

                <div style={{ marginTop: '1.5rem' }}>
                  {activeTab === 'clusters' && <CustomerClusters data={analysisData} />}
                  {activeTab === 'sequential' && <SequentialExtraction data={analysisData} />}
                  {activeTab === 'reports' && <ProfessionalReports data={analysisData} />}
                  {activeTab === 'validation' && <FieldValidation data={analysisData} />}
                  {activeTab === 'analytics' && <Analytics data={analysisData} />}
                  {activeTab === 'downloads' && <Downloads data={analysisData} />}
                  {activeTab === 'search' && <SearchFilter data={analysisData} />}
                </div>
              </div>

              {/* Reset Button */}
              <div className="text-center" style={{ marginTop: '2rem' }}>
                <button 
                  onClick={() => {
                    setAnalysisData({
                      extractedData: [],
                      individualTexts: {},
                      structuredData: {},
                      documentClusters: {},
                      isProcessed: false
                    });
                    setActiveTab('upload');
                  }}
                  className="btn-secondary"
                >
                  🔄 Process New Documents
                </button>
              </div>
            </>
          )}

          {/* Features Guide */}
          <div className="card" style={{ marginTop: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>
              💡 Ultra-Accurate Extraction Guide
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#2563eb', marginBottom: '0.5rem' }}>
                  🎯 99.9% Accuracy Features
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ GST Numbers: 15-character format validation</li>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ PAN Numbers: 10-character alphanumeric validation</li>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ Container Numbers: 4 letters + 7 digits validation</li>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ IEC Codes: 10-digit validation</li>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ Email & Phone: Format verification</li>
                </ul>
              </div>
              
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#9333ea', marginBottom: '0.5rem' }}>
                  📊 Best Practices
                </h3>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ Upload clear, high-resolution scans (300+ DPI)</li>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ Ensure all text is readable</li>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ Include complete documents (all pages)</li>
                  <li style={{ marginBottom: '0.5rem', color: '#4b5563' }}>✅ Use standard formats (PDF, JPG, DOCX)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ background: '#111827', color: 'white', padding: '2rem 0', marginTop: '4rem' }}>
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem', textAlign: 'center' }}>
            <p style={{ color: '#9ca3af' }}>
              © 2024 Ultra-Accurate Customs Document Analyzer. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;