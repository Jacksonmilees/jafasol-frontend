import React, { useState } from 'react';
import { Timetable, TimetableSlot, SchoolDay } from '../../types';
import { XIcon, DownloadIcon, PrinterIcon, SettingsIcon } from '../icons';

interface TimetablePDFExportProps {
  title: string;
  timetable: Timetable;
  schoolDays: SchoolDay[];
  slots: TimetableSlot[];
  viewMode: 'personal' | 'class';
  teacherName?: string;
  className?: string;
  onClose: () => void;
}

export const TimetablePDFExport: React.FC<TimetablePDFExportProps> = ({
  title,
  timetable,
  schoolDays,
  slots,
  viewMode,
  teacherName,
  className,
  onClose
}) => {
  const [exportOptions, setExportOptions] = useState({
    includeHeader: true,
    includeFooter: true,
    includeStatistics: true,
    colorCoded: true,
    paperSize: 'A4',
    orientation: 'landscape'
  });

  const [isGenerating, setIsGenerating] = useState(false);

  // Generate unique filename
  const generateFilename = () => {
    const timestamp = new Date().toISOString().split('T')[0];
    const safeName = title.replace(/[^a-zA-Z0-9]/g, '_');
    return `${safeName}_${timestamp}.pdf`;
  };

  // Get teaching periods for each day
  const getTeachingPeriods = (day: SchoolDay) => {
    return day.periods.filter(period => period.type === 'Teaching');
  };

  // Find slot for specific day and period
  const findSlot = (day: string, periodId: string): TimetableSlot | null => {
    return slots.find(slot => 
      slot.day === day && slot.periodId === periodId
    ) || null;
  };

  // Get all unique periods across all days
  const allPeriods = schoolDays.reduce((periods, day) => {
    const teachingPeriods = getTeachingPeriods(day);
    teachingPeriods.forEach(period => {
      if (!periods.find(p => p.id === period.id)) {
        periods.push(period);
      }
    });
    return periods;
  }, [] as any[]);

  const handleGeneratePDF = async () => {
    setIsGenerating(true);
    try {
      // Create a new window with the printable content
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Unable to open print window');
      }

      // Generate the HTML content for PDF
      const htmlContent = generatePrintableHTML();
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();

      // Wait for content to load, then trigger print
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
          printWindow.close();
        }, 500);
      };

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePrintableHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #333;
            background: white;
        }
        
        .page {
            width: 100%;
            margin: 0;
            padding: 20px;
            ${exportOptions.orientation === 'landscape' ? 'min-height: 210mm;' : 'min-height: 297mm;'}
        }
        
        @media print {
            .page {
                margin: 0;
                padding: 15mm;
                page-break-after: always;
            }
            
            @page {
                size: ${exportOptions.paperSize} ${exportOptions.orientation};
                margin: 0;
            }
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 15px;
            margin-bottom: 20px;
        }
        
        .school-logo {
            font-size: 28px;
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 5px;
        }
        
        .timetable-title {
            font-size: 18px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 5px;
        }
        
        .subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 10px;
        }
        
        .academic-info {
            background: #f3f4f6;
            padding: 8px 15px;
            border-radius: 8px;
            display: inline-block;
            font-size: 12px;
            color: #374151;
        }
        
        .timetable-container {
            margin: 20px 0;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .timetable {
            width: 100%;
            border-collapse: collapse;
            background: white;
        }
        
        .header-row {
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
            color: white;
        }
        
        .header-cell {
            padding: 12px 8px;
            text-align: center;
            font-weight: bold;
            font-size: 11px;
            border-right: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .time-cell {
            background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
            padding: 10px 8px;
            text-align: center;
            border-right: 2px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
            font-weight: 600;
            color: #374151;
            min-width: 80px;
        }
        
        .period-name {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 2px;
        }
        
        .period-time {
            font-size: 9px;
            color: #6b7280;
            margin-bottom: 1px;
        }
        
        .period-duration {
            font-size: 8px;
            color: #9ca3af;
        }
        
        .slot-cell {
            padding: 6px;
            border-right: 1px solid #e5e7eb;
            border-bottom: 1px solid #e5e7eb;
            min-height: 60px;
            vertical-align: top;
        }
        
        .slot-content {
            background: #e0f2fe;
            border: 2px solid #0284c7;
            border-radius: 6px;
            padding: 6px;
            height: 100%;
            min-height: 48px;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .personal-slot {
            background: #e0e7ff;
            border-color: #4f46e5;
        }
        
        .class-slot {
            background: #ecfdf5;
            border-color: #059669;
        }
        
        .exam-slot {
            background: #fef2f2;
            border-color: #dc2626;
        }
        
        .free-slot {
            background: transparent;
            border: 2px dashed #d1d5db;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #9ca3af;
            font-style: italic;
        }
        
        .subject-name {
            font-weight: bold;
            font-size: 10px;
            margin-bottom: 2px;
            color: #1f2937;
        }
        
        .slot-detail {
            font-size: 8px;
            color: #4b5563;
            margin-bottom: 1px;
        }
        
        .exam-badge {
            background: #dc2626;
            color: white;
            font-size: 7px;
            padding: 1px 4px;
            border-radius: 3px;
            font-weight: bold;
            margin-top: 2px;
            display: inline-block;
        }
        
        .double-period-badge {
            background: #7c3aed;
            color: white;
            font-size: 7px;
            padding: 1px 4px;
            border-radius: 3px;
            font-weight: bold;
            margin-top: 2px;
            display: inline-block;
        }
        
        .statistics {
            margin-top: 20px;
            background: #f9fafb;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
        }
        
        .stats-title {
            font-size: 14px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
        }
        
        .stat-item {
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 6px;
            padding: 8px;
            text-align: center;
        }
        
        .stat-value {
            font-size: 16px;
            font-weight: bold;
            color: #4f46e5;
        }
        
        .stat-label {
            font-size: 10px;
            color: #6b7280;
            margin-top: 2px;
        }
        
        .footer {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 10px;
        }
        
        .footer-brand {
            font-weight: bold;
            color: #4f46e5;
        }
        
        .legend {
            margin-top: 15px;
            padding: 10px;
            background: #f9fafb;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
        }
        
        .legend-title {
            font-size: 11px;
            font-weight: bold;
            margin-bottom: 5px;
            color: #374151;
        }
        
        .legend-items {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            font-size: 9px;
            color: #4b5563;
        }
        
        .legend-color {
            width: 12px;
            height: 12px;
            border-radius: 3px;
            margin-right: 5px;
            border: 1px solid #d1d5db;
        }
        
        .row-stripe:nth-child(even) {
            background: #fafafa;
        }
    </style>
</head>
<body>
    <div class="page">
        ${exportOptions.includeHeader ? generateHeader() : ''}
        
        <div class="timetable-container">
            <table class="timetable">
                ${generateTableHeader()}
                ${generateTableBody()}
            </table>
        </div>
        
        ${exportOptions.colorCoded ? generateLegend() : ''}
        ${exportOptions.includeStatistics ? generateStatistics() : ''}
        ${exportOptions.includeFooter ? generateFooter() : ''}
    </div>
</body>
</html>`;
  };

  const generateHeader = () => {
    return `
        <div class="header">
            <div class="school-logo">🎓 JAFASOL SCHOOL</div>
            <div class="timetable-title">${title}</div>
            <div class="subtitle">
                ${teacherName ? `Teacher: ${teacherName}` : ''}
                ${className ? `Class: ${className}` : ''}
            </div>
            <div class="academic-info">
                Academic Year: ${timetable.academicYear} | Term: ${timetable.term} | Generated: ${new Date().toLocaleDateString()}
            </div>
        </div>`;
  };

  const generateTableHeader = () => {
    return `
        <tr class="header-row">
            <th class="header-cell">⏰ TIME</th>
            ${schoolDays.map(day => `
                <th class="header-cell">${day.day.toUpperCase()}</th>
            `).join('')}
        </tr>`;
  };

  const generateTableBody = () => {
    return allPeriods.map((period, index) => `
        <tr class="row-stripe">
            <td class="time-cell">
                <div class="period-name">${period.name}</div>
                <div class="period-time">${period.startTime} - ${period.endTime}</div>
                <div class="period-duration">${period.duration} min</div>
            </td>
            ${schoolDays.map(day => {
              const dayHasPeriod = getTeachingPeriods(day).some(p => p.id === period.id);
              
              if (!dayHasPeriod) {
                return `<td class="slot-cell"><div class="free-slot">N/A</div></td>`;
              }

              const slot = findSlot(day.day, period.id);
              
              if (!slot) {
                return `<td class="slot-cell"><div class="free-slot">Free Period</div></td>`;
              }

              const slotClass = slot.isExam ? 'exam-slot' : 
                               viewMode === 'personal' ? 'personal-slot' : 'class-slot';

              return `
                <td class="slot-cell">
                    <div class="slot-content ${slotClass}">
                        <div class="subject-name">${slot.subjectId}</div>
                        <div class="slot-detail">
                            ${viewMode === 'personal' 
                              ? `📚 ${slot.classId}` 
                              : `👨‍🏫 ${slot.teacherId}`
                            }
                        </div>
                        ${slot.roomId ? `<div class="slot-detail">🏫 Room ${slot.roomId}</div>` : ''}
                        ${slot.isExam ? '<span class="exam-badge">EXAM</span>' : ''}
                        ${slot.isDoublePeriod ? '<span class="double-period-badge">DOUBLE</span>' : ''}
                    </div>
                </td>`;
            }).join('')}
        </tr>
    `).join('');
  };

  const generateLegend = () => {
    return `
        <div class="legend">
            <div class="legend-title">📊 Legend</div>
            <div class="legend-items">
                <div class="legend-item">
                    <div class="legend-color" style="background: #e0e7ff; border-color: #4f46e5;"></div>
                    Teaching Periods
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: transparent; border: 2px dashed #d1d5db;"></div>
                    Free Periods
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #fef2f2; border-color: #dc2626;"></div>
                    Exam Periods
                </div>
                <div class="legend-item">
                    <div class="legend-color" style="background: #ecfdf5; border-color: #059669;"></div>
                    Double Periods
                </div>
            </div>
        </div>`;
  };

  const generateStatistics = () => {
    const totalPeriods = allPeriods.length * schoolDays.length;
    const scheduledPeriods = slots.length;
    const freePeriodsCount = totalPeriods - scheduledPeriods;
    const utilizationRate = totalPeriods > 0 ? Math.round((scheduledPeriods / totalPeriods) * 100) : 0;
    
    const subjectCounts = slots.reduce((acc, slot) => {
      acc[slot.subjectId] = (acc[slot.subjectId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return `
        <div class="statistics">
            <div class="stats-title">📈 Schedule Statistics</div>
            <div class="stats-grid">
                <div class="stat-item">
                    <div class="stat-value">${scheduledPeriods}</div>
                    <div class="stat-label">Total Periods</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${utilizationRate}%</div>
                    <div class="stat-label">Utilization Rate</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${Object.keys(subjectCounts).length}</div>
                    <div class="stat-label">Subjects</div>
                </div>
                <div class="stat-item">
                    <div class="stat-value">${freePeriodsCount}</div>
                    <div class="stat-label">Free Periods</div>
                </div>
            </div>
        </div>`;
  };

  const generateFooter = () => {
    return `
        <div class="footer">
            <p>Generated by <span class="footer-brand">Jafasol School Management System</span></p>
            <p>📧 Contact: admin@jafasol.com | 📞 Phone: +1234567890 | 🌐 www.jafasol.com</p>
            <p>This is an automatically generated timetable. For any discrepancies, please contact the administration office.</p>
        </div>`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <DownloadIcon className="h-6 w-6 text-indigo-600 mr-3" />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Export Timetable</h2>
              <p className="text-gray-600 mt-1">Generate a PDF version of your timetable</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <XIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Export Options */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Export Options
            </h3>
            
            <div className="space-y-4">
              {/* Include Options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Include in PDF</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeHeader}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeHeader: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Header with school information</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeFooter}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeFooter: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Footer with contact information</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.includeStatistics}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, includeStatistics: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Statistics and summary</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exportOptions.colorCoded}
                      onChange={(e) => setExportOptions(prev => ({ ...prev, colorCoded: e.target.checked }))}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Color-coded legend</span>
                  </label>
                </div>
              </div>

              {/* Page Settings */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Paper Size</label>
                  <select
                    value={exportOptions.paperSize}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, paperSize: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Orientation</label>
                  <select
                    value={exportOptions.orientation}
                    onChange={(e) => setExportOptions(prev => ({ ...prev, orientation: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white"
                  >
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Info */}
          <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
            <h4 className="text-sm font-medium text-indigo-900 mb-2">📄 Export Preview</h4>
            <div className="text-sm text-indigo-700 space-y-1">
              <p><strong>Title:</strong> {title}</p>
              <p><strong>Periods:</strong> {slots.length} scheduled periods</p>
              <p><strong>Days:</strong> {schoolDays.length} days</p>
              <p><strong>Format:</strong> {exportOptions.paperSize} {exportOptions.orientation}</p>
              <p><strong>Filename:</strong> {generateFilename()}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t border-gray-200 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              The PDF will open in a new window for printing or saving.
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-white text-gray-700 border border-gray-300 font-medium rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              
              <button
                onClick={handleGeneratePDF}
                disabled={isGenerating}
                className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <DownloadIcon className="h-4 w-4 mr-2" />
                    Generate PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};



