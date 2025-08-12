import React, { useState, useEffect } from 'react';
import { COMMON_STREAMS, getSystemStreams } from '../../constants/educationSystems';
import { ChevronDownIcon } from '../icons';

interface SmartStreamSelectorProps {
  value: string;
  onChange: (stream: string) => void;
  selectedSystem?: string;
  existingStreams?: string[];
  placeholder?: string;
  label?: string;
}

export const SmartStreamSelector: React.FC<SmartStreamSelectorProps> = ({ 
  value, 
  onChange, 
  selectedSystem,
  existingStreams = [],
  placeholder = "Select or enter stream...",
  label = "Stream/Section"
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [suggestedStreams, setSuggestedStreams] = useState<string[]>([]);

  // Update suggested streams based on selected system and existing streams
  useEffect(() => {
    let streams: string[] = [];
    
    // Add system-specific streams if available
    if (selectedSystem) {
      streams = [...getSystemStreams(selectedSystem)];
    }
    
    // Add existing streams from the school
    streams = [...streams, ...existingStreams];
    
    // Add common streams
    streams = [...streams, ...COMMON_STREAMS.slice(0, 20)]; // Limit to top 20
    
    // Remove duplicates and sort
    const uniqueStreams = [...new Set(streams)].sort();
    setSuggestedStreams(uniqueStreams);
  }, [selectedSystem, existingStreams]);

  const handleStreamSelect = (stream: string) => {
    onChange(stream);
    setIsDropdownOpen(false);
    
    // Save common stream preference
    if (COMMON_STREAMS.includes(stream)) {
      localStorage.setItem('preferred_stream', stream);
    }
  };

  const handleCustomAdd = () => {
    if (customInput.trim()) {
      onChange(customInput.trim());
      setCustomInput('');
      setShowCustomInput(false);
      setIsDropdownOpen(false); // Close dropdown after custom addition
    }
  };

  const getStreamCategory = (stream: string): string => {
    if (['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(stream)) return 'letters';
    if (['Science', 'Arts', 'Commerce', 'Technical', 'Languages', 'Humanities'].includes(stream)) return 'subjects';
    if (['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'].includes(stream)) return 'colors';
    if (['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon'].includes(stream)) return 'greek';
    if (['North', 'South', 'East', 'West', 'Central'].includes(stream)) return 'directions';
    if (existingStreams.includes(stream)) return 'existing';
    return 'other';
  };

  const groupedStreams = {
    existing: suggestedStreams.filter(s => existingStreams.includes(s)),
    letters: suggestedStreams.filter(s => getStreamCategory(s) === 'letters'),
    subjects: suggestedStreams.filter(s => getStreamCategory(s) === 'subjects'),
    colors: suggestedStreams.filter(s => getStreamCategory(s) === 'colors'),
    greek: suggestedStreams.filter(s => getStreamCategory(s) === 'greek'),
    directions: suggestedStreams.filter(s => getStreamCategory(s) === 'directions'),
    other: suggestedStreams.filter(s => getStreamCategory(s) === 'other')
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {/* Current Selection */}
      {value && (
        <div className="mb-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Selected: {value}
            <button
              type="button"
              onClick={() => onChange('')}
              className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-blue-600 hover:bg-blue-200 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        </div>
      )}

      {/* Stream Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors text-base font-medium"
        >
          <span className="text-slate-700">
            {value || placeholder}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>

        {isDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
            <div className="p-1">
              
              {/* Existing Streams */}
              {groupedStreams.existing.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-2 text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                    Your School's Streams
                  </div>
                  {groupedStreams.existing.map(stream => (
                    <button
                      key={stream}
                      type="button"
                      onClick={() => handleStreamSelect(stream)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-emerald-50 rounded-md text-emerald-700"
                    >
                      {stream}
                    </button>
                  ))}
                </div>
              )}

              {/* Letter Streams */}
              {groupedStreams.letters.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Letter Streams
                  </div>
                  <div className="grid grid-cols-5 gap-1 px-3 py-1">
                    {groupedStreams.letters.map(stream => (
                      <button
                        key={stream}
                        type="button"
                        onClick={() => handleStreamSelect(stream)}
                        className="px-2 py-1 text-xs text-center border border-slate-200 rounded hover:bg-slate-100"
                      >
                        {stream}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Subject Streams */}
              {groupedStreams.subjects.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Subject Streams
                  </div>
                  {groupedStreams.subjects.map(stream => (
                    <button
                      key={stream}
                      type="button"
                      onClick={() => handleStreamSelect(stream)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md"
                    >
                      {stream}
                    </button>
                  ))}
                </div>
              )}

              {/* Color Streams */}
              {groupedStreams.colors.length > 0 && (
                <div className="mb-3">
                  <div className="px-3 py-2 text-sm font-semibold text-slate-500 uppercase tracking-wide">
                    Color Streams
                  </div>
                  <div className="grid grid-cols-3 gap-1 px-3 py-1">
                    {groupedStreams.colors.map(stream => (
                      <button
                        key={stream}
                        type="button"
                        onClick={() => handleStreamSelect(stream)}
                        className="px-2 py-1 text-xs text-center border border-slate-200 rounded hover:bg-slate-100"
                      >
                        {stream}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Input */}
              <div className="border-t border-slate-200 mt-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full text-left px-4 py-3 text-base text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium"
                >
                  Enter Custom Stream...
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom Input */}
      {showCustomInput && (
        <div className="border border-amber-200 bg-amber-50 rounded-lg p-3">
          <label className="block text-sm font-medium text-amber-800 mb-2">
            Enter Custom Stream
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., Innovation, STEM, Bilingual..."
              className="flex-1 px-3 py-2 border border-amber-300 rounded-md text-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              onKeyPress={(e) => e.key === 'Enter' && handleCustomAdd()}
            />
            <button
              type="button"
              onClick={handleCustomAdd}
              className="px-3 py-2 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowCustomInput(false)}
              className="px-3 py-2 bg-slate-300 text-slate-700 text-sm rounded-md hover:bg-slate-400"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Help Text */}
      <p className="text-sm text-slate-500">
        Choose from common options or create your own unique stream name
      </p>
    </div>
  );
};
