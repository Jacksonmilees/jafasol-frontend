import React, { useState } from 'react';
import { COMMON_STREAMS } from '../../constants/educationSystems';
import { XIcon, PlusIcon } from '../icons';

interface MultiStreamCreatorProps {
  formLevel: string;
  onStreamsCreate: (streams: string[]) => void;
  onClose: () => void;
  existingStreams?: string[];
}

export const MultiStreamCreator: React.FC<MultiStreamCreatorProps> = ({ 
  formLevel, 
  onStreamsCreate, 
  onClose,
  existingStreams = []
}) => {
  const [selectedStreams, setSelectedStreams] = useState<string[]>([]);
  const [customInput, setCustomInput] = useState('');

  // Common stream suggestions excluding already existing ones
  const availableStreams = COMMON_STREAMS.filter(stream => 
    !existingStreams.includes(`${formLevel} ${stream}`)
  ).slice(0, 20);

  const handleStreamToggle = (stream: string) => {
    setSelectedStreams(prev => 
      prev.includes(stream) 
        ? prev.filter(s => s !== stream)
        : [...prev, stream]
    );
  };

  const handleCustomAdd = () => {
    if (customInput.trim()) {
      const streams = customInput
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0 && !selectedStreams.includes(s));
      
      setSelectedStreams(prev => [...prev, ...streams]);
      setCustomInput('');
    }
  };

  const removeStream = (stream: string) => {
    setSelectedStreams(prev => prev.filter(s => s !== stream));
  };

  const handleCreate = () => {
    if (selectedStreams.length > 0) {
      onStreamsCreate(selectedStreams);
    }
  };

  const groupedStreams = {
    letters: availableStreams.filter(s => ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(s)),
    subjects: availableStreams.filter(s => ['Science', 'Arts', 'Commerce', 'Technical', 'Languages', 'Humanities'].includes(s)),
    colors: availableStreams.filter(s => ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'].includes(s)),
    other: availableStreams.filter(s => 
      !['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].includes(s) &&
      !['Science', 'Arts', 'Commerce', 'Technical', 'Languages', 'Humanities'].includes(s) &&
      !['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple'].includes(s)
    )
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-xl font-semibold text-slate-800">Create Multiple Classes</h2>
            <p className="text-sm text-slate-600 mt-1">For {formLevel} - Select multiple streams to create classes efficiently</p>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-slate-100"
          >
            <XIcon className="h-6 w-6 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Selected Streams Preview */}
          {selectedStreams.length > 0 && (
            <div className="bg-emerald-50 p-4 rounded-lg border border-emerald-200">
              <h3 className="text-base font-medium text-emerald-800 mb-3">Classes to Create:</h3>
              <div className="flex flex-wrap gap-2">
                {selectedStreams.map(stream => (
                  <span
                    key={stream}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800"
                  >
                    {formLevel} {stream}
                    <button
                      type="button"
                      onClick={() => removeStream(stream)}
                      className="ml-2 inline-flex h-4 w-4 items-center justify-center rounded-full text-emerald-600 hover:bg-emerald-200 hover:text-emerald-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quick Stream Selection */}
          {groupedStreams.letters.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Letter Streams</h3>
              <div className="grid grid-cols-5 gap-2">
                {groupedStreams.letters.map(stream => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => handleStreamToggle(stream)}
                    className={`px-3 py-2 text-sm text-center border rounded-lg transition-colors ${
                      selectedStreams.includes(stream)
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                        : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>
          )}

          {groupedStreams.subjects.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Subject Streams</h3>
              <div className="grid grid-cols-3 gap-2">
                {groupedStreams.subjects.map(stream => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => handleStreamToggle(stream)}
                    className={`px-3 py-2 text-sm text-center border rounded-lg transition-colors ${
                      selectedStreams.includes(stream)
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                        : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>
          )}

          {groupedStreams.colors.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Color Streams</h3>
              <div className="grid grid-cols-4 gap-2">
                {groupedStreams.colors.map(stream => (
                  <button
                    key={stream}
                    type="button"
                    onClick={() => handleStreamToggle(stream)}
                    className={`px-3 py-2 text-sm text-center border rounded-lg transition-colors ${
                      selectedStreams.includes(stream)
                        ? 'bg-indigo-100 border-indigo-300 text-indigo-800'
                        : 'border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Stream Input */}
          <div>
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wide mb-3">Add Custom Streams</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g., Innovation, STEM, Bilingual (separate with commas)"
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCustomAdd()}
              />
              <button
                type="button"
                onClick={handleCustomAdd}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Enter multiple streams separated by commas
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
          <p className="text-sm text-slate-600">
            {selectedStreams.length} class{selectedStreams.length !== 1 ? 'es' : ''} will be created
          </p>
          <div className="flex space-x-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 bg-white text-slate-700 border border-slate-300 font-medium rounded-lg hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleCreate}
              disabled={selectedStreams.length === 0}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed transition"
            >
              Create {selectedStreams.length} Class{selectedStreams.length !== 1 ? 'es' : ''}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};




