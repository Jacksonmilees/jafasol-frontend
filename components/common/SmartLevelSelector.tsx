import React, { useState, useEffect } from 'react';
import { EDUCATION_SYSTEMS, getSystemLevels, getAllLevels } from '../../constants/educationSystems';
import { ChevronDownIcon } from '../icons';

interface SmartLevelSelectorProps {
  value: string[];
  onChange: (levels: string[]) => void;
  placeholder?: string;
  multiple?: boolean;
  label?: string;
}

export const SmartLevelSelector: React.FC<SmartLevelSelectorProps> = ({ 
  value, 
  onChange, 
  placeholder = "Select education levels...",
  multiple = true,
  label = "Education Levels"
}) => {
  const [selectedSystem, setSelectedSystem] = useState<string>('');
  const [isSystemDropdownOpen, setIsSystemDropdownOpen] = useState(false);
  const [isLevelDropdownOpen, setIsLevelDropdownOpen] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [availableLevels, setAvailableLevels] = useState<string[]>([]);

  // Load preferred system on mount
  useEffect(() => {
    const preferredSystem = localStorage.getItem('preferred_education_system');
    if (preferredSystem && EDUCATION_SYSTEMS.find(s => s.id === preferredSystem)) {
      setSelectedSystem(preferredSystem);
    }
  }, []);

  // Initialize available levels
  useEffect(() => {
    if (selectedSystem) {
      setAvailableLevels(getSystemLevels(selectedSystem));
    } else {
      setAvailableLevels(getAllLevels());
    }
  }, [selectedSystem]);

  const handleSystemSelect = (systemId: string) => {
    setSelectedSystem(systemId);
    setIsSystemDropdownOpen(false);
    
    // Auto-select all levels for the chosen system
    const systemLevels = getSystemLevels(systemId);
    if (multiple) {
      onChange(systemLevels);
    } else {
      onChange(systemLevels.slice(0, 1)); // Just first level for single select
    }
    
    // Save preference for next time
    localStorage.setItem('preferred_education_system', systemId);
  };

  const handleLevelToggle = (level: string) => {
    if (multiple) {
      const newValue = value.includes(level) 
        ? value.filter(l => l !== level)
        : [...value, level];
      onChange(newValue);
    } else {
      onChange([level]);
      setIsLevelDropdownOpen(false);
    }
  };

  const handleCustomAdd = () => {
    if (customInput.trim()) {
      const levels = customInput
        .split(',')
        .map(l => l.trim())
        .filter(l => l.length > 0);
      
      if (multiple) {
        const newValue = [...new Set([...value, ...levels])];
        onChange(newValue);
      } else {
        onChange(levels.slice(0, 1));
      }
      
      setCustomInput('');
      setShowCustomInput(false);
    }
  };

  const removeLevel = (levelToRemove: string) => {
    onChange(value.filter(l => l !== levelToRemove));
  };

  const clearSelection = () => {
    onChange([]);
    setSelectedSystem('');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700">{label}</label>
      
      {/* Quick System Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsSystemDropdownOpen(!isSystemDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors text-base font-medium"
        >
          <span className="text-indigo-700">
            {selectedSystem ? 
              EDUCATION_SYSTEMS.find(s => s.id === selectedSystem)?.label : 
              "Quick Select: Choose Your Education System"
            }
          </span>
          <ChevronDownIcon className="h-4 w-4 text-indigo-600" />
        </button>

        {isSystemDropdownOpen && (
          <div className="absolute z-20 w-full mt-2 bg-white border border-slate-200 rounded-lg shadow-xl max-h-80 overflow-y-auto">
            <div className="p-4">
              <div className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">African Systems</div>
              {EDUCATION_SYSTEMS.filter(s => ['Kenya', 'Nigeria', 'South Africa'].includes(s.country || '')).map(system => (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => handleSystemSelect(system.id)}
                  className="w-full text-left px-4 py-3 text-base hover:bg-slate-100 rounded-lg border-b border-slate-100 last:border-b-0"
                >
                  {system.label}
                </button>
              ))}
              
              <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2 mt-3">International Systems</div>
              {EDUCATION_SYSTEMS.filter(s => ['United States', 'United Kingdom', 'India'].includes(s.country || '') || s.system === 'International').map(system => (
                <button
                  key={system.id}
                  type="button"
                  onClick={() => handleSystemSelect(system.id)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 rounded-md"
                >
                  {system.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected Levels Display */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map(level => (
            <span
              key={level}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800"
            >
              {level}
              <button
                type="button"
                onClick={() => removeLevel(level)}
                className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-teal-600 hover:bg-teal-200 hover:text-teal-800"
              >
                ×
              </button>
            </span>
          ))}
          <button
            type="button"
            onClick={clearSelection}
            className="text-xs text-slate-500 hover:text-slate-700"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Manual Level Selector */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsLevelDropdownOpen(!isLevelDropdownOpen)}
          className="w-full flex items-center justify-between px-3 py-2 border border-slate-300 rounded-lg hover:border-slate-400 transition-colors text-sm"
        >
          <span className="text-slate-700">
            {multiple ? "Add Individual Levels" : "Select Level"}
          </span>
          <ChevronDownIcon className="h-4 w-4 text-slate-400" />
        </button>

        {isLevelDropdownOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            <div className="p-1">
              {availableLevels.map(level => (
                <button
                  key={level}
                  type="button"
                  onClick={() => handleLevelToggle(level)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                    value.includes(level) 
                      ? 'bg-teal-100 text-teal-800' 
                      : 'hover:bg-slate-100'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    {level}
                    {value.includes(level) && <span className="text-teal-600">✓</span>}
                  </span>
                </button>
              ))}
              
              <div className="border-t border-slate-200 mt-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(true)}
                  className="w-full text-left px-4 py-3 text-base text-indigo-600 hover:bg-indigo-50 rounded-lg font-medium"
                >
                  Add Custom Level...
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
            Add Custom Level(s)
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="e.g., Nursery, Pre-K, Foundation..."
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
          <p className="text-xs text-amber-600 mt-1">
            Separate multiple levels with commas
          </p>
        </div>
      )}

      {/* Help Text */}
      <p className="text-sm text-slate-500">
        Use Quick Select for standard systems, or add individual/custom levels as needed
      </p>
    </div>
  );
};
