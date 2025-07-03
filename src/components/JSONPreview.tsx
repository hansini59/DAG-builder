import React from 'react';
import { X, Copy, Download } from 'lucide-react';
import { Node, Edge } from '@xyflow/react';

interface JSONPreviewProps {
  nodes: Node[];
  edges: Edge[];
  onClose: () => void;
}

const JSONPreview: React.FC<JSONPreviewProps> = ({ nodes, edges, onClose }) => {
  const data = {
    pipeline: {
      metadata: {
        name: "Pipeline DAG",
        created: new Date().toISOString(),
        nodeCount: nodes.length,
        edgeCount: edges.length,
      },
      nodes: nodes.map(node => ({
        id: node.id,
        label: node.data.label,
        position: {
          x: Math.round(node.position.x),
          y: Math.round(node.position.y),
        },
        type: node.type || 'custom',
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        source: edge.source,
        target: edge.target,
        type: edge.type || 'default',
      })),
    }
  };

  const jsonString = JSON.stringify(data, null, 2);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      alert('JSON copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = jsonString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('JSON copied to clipboard!');
    }
  };

  const downloadJSON = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pipeline-dag-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-gray-800 border border-gray-700 rounded-xl w-full max-w-4xl max-h-[85vh] overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-750">
          <div>
            <h3 className="text-xl font-semibold text-white">Pipeline JSON Structure</h3>
            <p className="text-gray-400 text-sm mt-1">
              {nodes.length} nodes, {edges.length} edges
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={copyToClipboard}
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              title="Copy to clipboard"
            >
              <Copy size={16} />
              <span className="hidden sm:inline">Copy</span>
            </button>
            <button
              onClick={downloadJSON}
              className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg transition-all duration-200 hover:scale-105"
              title="Download JSON file"
            >
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </button>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-700 rounded-lg"
              title="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>
        
        <div className="p-6 overflow-auto max-h-[calc(85vh-120px)]">
          <pre className="text-sm text-gray-300 bg-gray-900 p-6 rounded-lg overflow-x-auto border border-gray-700 font-mono leading-relaxed">
            {jsonString}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default JSONPreview;