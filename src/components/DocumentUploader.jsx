import React, { useState, useRef } from 'react';
import { Upload, File, X, AlertCircle } from 'lucide-react';
import axios from 'axios';

const DocumentUploader = ({ onAnalysisComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const acceptedFileTypes = [
    '.pdf', '.png', '.jpg', '.jpeg', '.bmp', '.tiff', '.webp',
    '.docx', '.doc', '.xlsx', '.xls', '.csv', '.txt', '.zip'
  ];

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
    setError(null);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const droppedFiles = Array.from(event.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
    setError(null);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setError('Please select at least one file');
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    try {
      // Simulate progress for demo - replace with actual API call
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Replace this URL with your actual backend API endpoint
      // const response = await axios.post('http://localhost:8000/analyze', formData, {
      //   headers: {
      //     'Content-Type': 'multipart/form-data'
      //   },
      //   onUploadProgress: (progressEvent) => {
      //     const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      //     setUploadProgress(percentCompleted);
      //   }
      // });

      // For demo purposes, simulate response
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);

        // Simulated response data
        const mockData = {
          extractedData: files.map((file, idx) => ({
            filename: file.name,
            text: 'Sample extracted text...',
            word_count: 150,
            quality_score: 85 + Math.random() * 15,
            extraction_quality: 85 + Math.random() * 15,
            file_type: file.name.split('.').pop().toUpperCase(),
            document_type: 'commercial_invoice',
            type_confidence: 90,
            ai_extracted_fields: 15,
            extraction_date: new Date().toISOString()
          })),
          individualTexts: {},
          structuredData: {},
          documentClusters: {
            0: [0, 1],
            1: [2]
          }
        };

        onAnalysisComplete(mockData);
        setUploading(false);
        setFiles([]);
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed. Please try again.');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="card animate-fadeIn">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📤 Upload Documents for Ultra-Accurate Analysis</h2>

      {/* Upload Area */}
      <div
        className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:border-blue-500 transition-colors"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-semibold text-gray-700 mb-2">
          Drop your customs documents here or click to browse
        </p>
        <p className="text-gray-500 mb-4">
          PDF, Images, Word, Excel, CSV, ZIP - Up to 100MB per file
        </p>
        <button className="btn-primary">
          Select Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedFileTypes.join(',')}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {/* Selected Files List */}
      {files.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Selected Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <File className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            ))}
          </div>

          {/* Upload Button */}
          <div className="mt-6 flex gap-4">
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="btn-primary flex-1"
            >
              {uploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  🚀 Start Ultra-Accurate Analysis
                </>
              )}
            </button>
            {!uploading && (
              <button
                onClick={() => setFiles([])}
                className="btn-secondary"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Processing documents...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="progress-bar">
                <div 
                  className="progress-bar-fill"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-red-900">Upload Error</h4>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Info Box */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h4 className="font-semibold text-blue-900 mb-2">ℹ️ Supported Formats</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-blue-700">
          <div>✅ PDF Documents</div>
          <div>✅ Images (JPG, PNG)</div>
          <div>✅ Word Files (DOCX)</div>
          <div>✅ Excel Files (XLSX)</div>
          <div>✅ CSV Files</div>
          <div>✅ Text Files</div>
          <div>✅ ZIP Archives</div>
          <div>✅ Scanned Documents</div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;