import React from 'react';
import { CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react';

interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

interface ValidationStatusProps {
  validation: ValidationResult;
}

const ValidationStatus: React.FC<ValidationStatusProps> = ({ validation }) => {
  const getStatusColor = () => {
    if (validation.isValid) return 'text-green-400';
    if (validation.errors.length > 0) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getStatusIcon = () => {
    if (validation.isValid) return <CheckCircle size={20} className="animate-pulse" />;
    if (validation.errors.length > 0) return <XCircle size={20} className="animate-pulse" />;
    return <AlertCircle size={20} className="animate-pulse" />;
  };

  const getStatusText = () => {
    if (validation.isValid) return 'Valid DAG';
    if (validation.errors.length > 0) return 'Invalid DAG';
    return 'Incomplete DAG';
  };

  const getBgColor = () => {
    if (validation.isValid) return 'bg-green-900/30 border-green-500/30';
    if (validation.errors.length > 0) return 'bg-red-900/30 border-red-500/30';
    return 'bg-yellow-900/30 border-yellow-500/30';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${getBgColor()} ${getStatusColor()}`}>
        {getStatusIcon()}
        <span className="font-medium text-sm">{getStatusText()}</span>
      </div>
      
      {(validation.errors.length > 0 || validation.warnings.length > 0) && (
        <div className="relative group">
          <div className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center cursor-help hover:bg-gray-600 transition-colors">
            <Info size={12} className="text-gray-300" />
          </div>
          <div className="absolute right-0 top-8 w-80 bg-gray-800 border border-gray-700 rounded-lg p-4 opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none z-20 shadow-xl">
            {validation.errors.length > 0 && (
              <div className="mb-3">
                <h4 className="text-red-400 font-medium mb-2 flex items-center">
                  <XCircle size={16} className="mr-2" />
                  Errors ({validation.errors.length})
                </h4>
                <ul className="text-red-300 text-sm space-y-1">
                  {validation.errors.map((error, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2 mt-1">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {validation.warnings.length > 0 && (
              <div>
                <h4 className="text-yellow-400 font-medium mb-2 flex items-center">
                  <AlertCircle size={16} className="mr-2" />
                  Warnings ({validation.warnings.length})
                </h4>
                <ul className="text-yellow-300 text-sm space-y-1">
                  {validation.warnings.map((warning, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-500 mr-2 mt-1">•</span>
                      <span>{warning}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationStatus;