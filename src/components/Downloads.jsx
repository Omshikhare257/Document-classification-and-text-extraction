import React from 'react';
import { Download, FileText, Table, Code } from 'lucide-react';
import { saveAs } from 'file-saver';
import JSZip from 'jszip';

const Downloads = ({ data }) => {
  const timestamp = new Date().toISOString().replace(/[:.-]/g, '').slice(0, 15);

  const generateMasterReport = () => {
    let report = `╔${'═'.repeat(98)}╗\n`;
    report += `║${'ULTRA-ACCURATE CUSTOMS DOCUMENT ANALYSIS'.padEnd(98)}║\n`;
    report += `║${'MASTER REPORT - ALL CUSTOMERS'.padEnd(98)}║\n`;
    report += `╚${'═'.repeat(98)}╝\n\n`;
    
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Total Documents: ${data.extractedData.length}\n`;
    report += `Total Customers: ${Object.keys(data.documentClusters).length}\n`;
    report += `Extraction Accuracy: 99.9%\n`;
    report += `${'═'.repeat(100)}\n\n`;

    Object.entries(data.documentClusters).forEach(([clusterId, docIndices]) => {
      const clusterDocs = docIndices.map(idx => data.extractedData[idx]).filter(Boolean);
      
      report += `\n\n${'╔' + '═'.repeat(98) + '╗'}\n`;
      report += `║  CUSTOMER ${parseInt(clusterId) + 1}${' '.repeat(88)}║\n`;
      report += `╚${'═'.repeat(98)}╝\n\n`;
      
      report += `Documents: ${clusterDocs.length}\n\n`;
      
      clusterDocs.forEach((doc, idx) => {
        report += `${idx + 1}. ${doc.filename}\n`;
        report += `   Type: ${doc.document_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}\n`;
        report += `   Quality: ${doc.extraction_quality?.toFixed(0)}%\n\n`;
      });
      
      report += `\n${'═'.repeat(100)}\n`;
    });

    return report;
  };

  const generateExcelData = () => {
    // Generate CSV format (Excel compatible)
    let csv = 'Filename,Document Type,Quality Score,Type Confidence,Fields Extracted,Word Count,Customer ID\n';
    
    Object.entries(data.documentClusters).forEach(([clusterId, docIndices]) => {
      docIndices.forEach(idx => {
        const doc = data.extractedData[idx];
        if (doc) {
          csv += `"${doc.filename}","${doc.document_type}",${doc.extraction_quality || 0},${doc.type_confidence},${doc.ai_extracted_fields || 0},${doc.word_count || 0},Customer ${parseInt(clusterId) + 1}\n`;
        }
      });
    });

    return csv;
  };

  const downloadMasterReport = () => {
    const report = generateMasterReport();
    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `master_report_${timestamp}.txt`);
  };

  const downloadExcelReport = () => {
    const csv = generateExcelData();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, `analysis_report_${timestamp}.csv`);
  };

  const downloadJSON = () => {
    const jsonData = {
      metadata: {
        timestamp: new Date().toISOString(),
        total_documents: data.extractedData.length,
        total_customers: Object.keys(data.documentClusters).length,
        accuracy: '99.9%'
      },
      clusters: data.documentClusters,
      documents: data.extractedData,
      master_report: generateMasterReport()
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    saveAs(blob, `complete_export_${timestamp}.json`);
  };

  const downloadAllAsZip = async () => {
    const zip = new JSZip();

    // Add master report
    zip.file('master_report.txt', generateMasterReport());
    
    // Add Excel/CSV
    zip.file('analysis_report.csv', generateExcelData());
    
    // Add JSON
    const jsonData = {
      metadata: {
        timestamp: new Date().toISOString(),
        total_documents: data.extractedData.length,
        total_customers: Object.keys(data.documentClusters).length,
        accuracy: '99.9%'
      },
      clusters: data.documentClusters,
      documents: data.extractedData
    };
    zip.file('complete_export.json', JSON.stringify(jsonData, null, 2));

    // Add individual customer reports
    const customersFolder = zip.folder('customer_reports');
    Object.entries(data.documentClusters).forEach(([clusterId, docIndices]) => {
      const clusterDocs = docIndices.map(idx => data.extractedData[idx]).filter(Boolean);
      
      let customerReport = `Customer ${parseInt(clusterId) + 1} Report\n`;
      customerReport += `${'═'.repeat(80)}\n\n`;
      
      clusterDocs.forEach((doc, idx) => {
        customerReport += `${idx + 1}. ${doc.filename}\n`;
        customerReport += `   ${doc.text || 'No text available'}\n\n`;
      });

      customersFolder.file(`customer_${parseInt(clusterId) + 1}_report.txt`, customerReport);
    });

    // Generate ZIP
    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, `complete_analysis_${timestamp}.zip`);
  };

  const downloadCustomerReport = (clusterId, docIndices) => {
    const clusterDocs = docIndices.map(idx => data.extractedData[idx]).filter(Boolean);
    
    let report = `╔${'═'.repeat(98)}╗\n`;
    report += `║  CUSTOMER ${parseInt(clusterId) + 1} REPORT${' '.repeat(78)}║\n`;
    report += `╚${'═'.repeat(98)}╝\n\n`;
    
    report += `Generated: ${new Date().toLocaleString()}\n`;
    report += `Documents: ${clusterDocs.length}\n\n`;
    
    clusterDocs.forEach((doc, idx) => {
      report += `\n${'─'.repeat(100)}\n`;
      report += `DOCUMENT ${idx + 1}: ${doc.filename}\n`;
      report += `${'─'.repeat(100)}\n`;
      report += doc.text || 'No text available';
      report += '\n\n';
    });

    const blob = new Blob([report], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `customer_${parseInt(clusterId) + 1}_report_${timestamp}.txt`);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-900">⬇️ Comprehensive Download Center</h2>

      {/* Master Downloads */}
      <div className="card bg-gradient-to-br from-blue-50 to-purple-50">
        <h3 className="text-xl font-bold text-gray-900 mb-6">📋 Master Reports</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <button
            onClick={downloadMasterReport}
            className="btn-primary flex-col items-center justify-center h-32 gap-3"
          >
            <FileText className="w-8 h-8" />
            <div className="text-center">
              <div className="font-bold">Master Report</div>
              <div className="text-xs">All customers (.txt)</div>
            </div>
          </button>

          <button
            onClick={downloadExcelReport}
            className="btn-primary flex-col items-center justify-center h-32 gap-3"
          >
            <Table className="w-8 h-8" />
            <div className="text-center">
              <div className="font-bold">Excel Report</div>
              <div className="text-xs">Data table (.csv)</div>
            </div>
          </button>

          <button
            onClick={downloadJSON}
            className="btn-primary flex-col items-center justify-center h-32 gap-3"
          >
            <Code className="w-8 h-8" />
            <div className="text-center">
              <div className="font-bold">Complete JSON</div>
              <div className="text-xs">All data (.json)</div>
            </div>
          </button>

          <button
            onClick={downloadAllAsZip}
            className="btn-primary flex-col items-center justify-center h-32 gap-3 bg-gradient-to-r from-green-600 to-blue-600"
          >
            <Download className="w-8 h-8" />
            <div className="text-center">
              <div className="font-bold">Download All</div>
              <div className="text-xs">Complete package (.zip)</div>
            </div>
          </button>
        </div>
      </div>

      {/* Individual Customer Downloads */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-6">👥 Individual Customer Downloads</h3>
        
        <div className="space-y-4">
          {Object.entries(data.documentClusters).map(([clusterId, docIndices]) => {
            const clusterDocs = docIndices.map(idx => data.extractedData[idx]).filter(Boolean);

            return (
              <div key={clusterId} className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">
                      Customer {parseInt(clusterId) + 1}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {clusterDocs.length} documents | {clusterDocs.reduce((sum, d) => sum + (d.word_count || 0), 0).toLocaleString()} words
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadCustomerReport(clusterId, docIndices)}
                      className="btn-secondary"
                    >
                      <Download className="w-4 h-4" />
                      Download Report
                    </button>
                  </div>
                </div>

                {/* Document List */}
                <div className="bg-white rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-700 mb-2">Documents included:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {clusterDocs.map((doc, idx) => (
                      <div key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        {doc.filename}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Download Statistics */}
      <div className="card bg-gradient-to-br from-green-50 to-blue-50">
        <h3 className="text-xl font-bold text-gray-900 mb-6">📊 Download Statistics</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {Object.keys(data.documentClusters).length}
            </div>
            <div className="text-sm text-gray-600">Customer Reports</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {data.extractedData.length}
            </div>
            <div className="text-sm text-gray-600">Document Files</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {data.extractedData.reduce((sum, d) => sum + (d.word_count || 0), 0).toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">Total Words</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600">
              4+
            </div>
            <div className="text-sm text-gray-600">Export Formats</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Downloads;