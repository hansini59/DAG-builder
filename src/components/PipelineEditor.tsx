import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Background,
  Controls,
  MiniMap,
  useReactFlow,
  ReactFlowProvider,
  Panel,
  ConnectionMode,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Plus, Layout, Trash2, Eye, ZoomIn, ZoomOut, Maximize2, RotateCcw } from 'lucide-react';
import CustomNode from './CustomNode';
import { validateDAG } from '../utils/dagValidation';
import { getLayoutedElements } from '../utils/autoLayout';
import ValidationStatus from './ValidationStatus';
import JSONPreview from './JSONPreview';

const nodeTypes = {
  custom: CustomNode,
};

const PipelineEditorContent: React.FC = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
  const [selectedEdges, setSelectedEdges] = useState<string[]>([]);
  const [showJSON, setShowJSON] = useState(false);
  const [nodeCounter, setNodeCounter] = useState(1);
  const [debugInfo, setDebugInfo] = useState<string>('');
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const validationResult = useMemo(() => validateDAG(nodes, edges), [nodes, edges]);

  // COMPLETELY REBUILT CONNECTION HANDLER
  const onConnect = useCallback((params: Connection) => {
    console.log('🚀 CONNECTION ATTEMPT:', params);
    setDebugInfo(`Connection attempt: ${params.source} → ${params.target}`);
    
    // Basic validation
    if (!params.source || !params.target) {
      console.error('❌ Missing source or target');
      setDebugInfo('❌ Missing source or target');
      return;
    }

    if (params.source === params.target) {
      console.error('❌ Self connection not allowed');
      setDebugInfo('❌ Self connection not allowed');
      return;
    }

    // Check for existing connection
    const exists = edges.some(edge => 
      edge.source === params.source && edge.target === params.target
    );
    
    if (exists) {
      console.error('❌ Connection already exists');
      setDebugInfo('❌ Connection already exists');
      return;
    }

    // Create the edge with MINIMAL configuration
    const newEdge: Edge = {
      id: `e${params.source}-${params.target}`,
      source: params.source,
      target: params.target,
      type: 'default',
      style: { stroke: '#ff6b6b', strokeWidth: 3 },
      animated: true,
    };

    console.log('✅ CREATING EDGE:', newEdge);
    setDebugInfo(`✅ Created: ${params.source} → ${params.target}`);

    // Use addEdge utility
    setEdges((eds) => addEdge(newEdge, eds));
  }, [edges, setEdges]);

  const addNode = useCallback(() => {
    const name = prompt('Enter node name:') || `Node ${nodeCounter}`;
    
    const newNode: Node = {
      id: `node_${nodeCounter}`,
      type: 'custom',
      position: { 
        x: Math.random() * 300 + 100, 
        y: Math.random() * 200 + 100 
      },
      data: { label: name },
    };

    console.log('➕ ADDING NODE:', newNode);
    setNodeCounter(prev => prev + 1);
    setNodes((nds) => [...nds, newNode]);
  }, [nodeCounter, setNodes]);

  const deleteSelected = useCallback(() => {
    if (selectedNodes.length > 0) {
      setNodes((nds) => nds.filter((node) => !selectedNodes.includes(node.id)));
      setEdges((eds) => eds.filter((edge) => 
        !selectedNodes.includes(edge.source) && !selectedNodes.includes(edge.target)
      ));
      setSelectedNodes([]);
    }
    
    if (selectedEdges.length > 0) {
      setEdges((eds) => eds.filter((edge) => !selectedEdges.includes(edge.id)));
      setSelectedEdges([]);
    }
  }, [selectedNodes, selectedEdges, setNodes, setEdges]);

  const onSelectionChange = useCallback((params: any) => {
    setSelectedNodes(params.nodes.map((node: Node) => node.id));
    setSelectedEdges(params.edges.map((edge: Edge) => edge.id));
  }, []);

  const applyAutoLayout = useCallback(() => {
    if (nodes.length < 2) {
      alert('Need at least 2 nodes for auto layout');
      return;
    }

    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(nodes, edges);
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
    
    setTimeout(() => fitView({ duration: 800, padding: 0.2 }), 100);
  }, [nodes, edges, setNodes, setEdges, fitView]);

  const clearPipeline = useCallback(() => {
    if (window.confirm('Clear everything?')) {
      setNodes([]);
      setEdges([]);
      setSelectedNodes([]);
      setSelectedEdges([]);
      setNodeCounter(1);
      setDebugInfo('');
    }
  }, [setNodes, setEdges]);

  const handleZoomIn = useCallback(() => zoomIn({ duration: 300 }), [zoomIn]);
  const handleZoomOut = useCallback(() => zoomOut({ duration: 300 }), [zoomOut]);
  const handleFitView = useCallback(() => fitView({ duration: 800, padding: 0.1 }), [fitView]);

  const handleReset = useCallback(() => {
    if (nodes.length > 0) {
      const resetNodes = nodes.map((node, index) => ({
        ...node,
        position: { 
          x: (index % 3) * 200 + 100, 
          y: Math.floor(index / 3) * 150 + 100 
        }
      }));
      setNodes(resetNodes);
      setTimeout(() => handleFitView(), 100);
    }
  }, [nodes, setNodes, handleFitView]);

  // Debug logging
  useEffect(() => {
    console.log(`📊 CURRENT STATE: ${nodes.length} nodes, ${edges.length} edges`);
    if (edges.length > 0) {
      console.log('🔗 EDGES:', edges);
    }
  }, [nodes.length, edges.length, edges]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Delete' || event.key === 'Backspace') {
        if (selectedNodes.length > 0 || selectedEdges.length > 0) {
          deleteSelected();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [deleteSelected, selectedNodes.length, selectedEdges.length]);

  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Pipeline Editor</h1>
          <div className="flex items-center space-x-4">
            <ValidationStatus validation={validationResult} />
            <div className="flex items-center space-x-2">
              <button
                onClick={addNode}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Plus size={20} />
                <span>Add Node</span>
              </button>
              
              <button
                onClick={applyAutoLayout}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={nodes.length < 2}
              >
                <Layout size={20} />
                <span>Auto Layout</span>
              </button>

              <div className="flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
                <button onClick={handleZoomIn} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-all duration-200">
                  <ZoomIn size={18} />
                </button>
                <button onClick={handleZoomOut} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-all duration-200">
                  <ZoomOut size={18} />
                </button>
                <button onClick={handleFitView} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-all duration-200">
                  <Maximize2 size={18} />
                </button>
                <button onClick={handleReset} className="p-2 text-gray-300 hover:text-white hover:bg-gray-600 rounded transition-all duration-200">
                  <RotateCcw size={18} />
                </button>
              </div>
              
              <button
                onClick={() => setShowJSON(!showJSON)}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Eye size={20} />
                <span>JSON</span>
              </button>
              
              <button
                onClick={clearPipeline}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <Trash2 size={20} />
                <span>Clear</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onSelectionChange={onSelectionChange}
          nodeTypes={nodeTypes}
          fitView
          className="bg-gray-900"
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.1}
          maxZoom={4}
          deleteKeyCode={['Delete', 'Backspace']}
          multiSelectionKeyCode={['Meta', 'Ctrl']}
          connectionMode={ConnectionMode.Loose}
          snapToGrid={true}
          snapGrid={[20, 20]}
          nodesDraggable={true}
          nodesConnectable={true}
          elementsSelectable={true}
          panOnDrag={true}
          zoomOnScroll={true}
          zoomOnPinch={true}
          connectionRadius={30}
          defaultEdgeOptions={{
            type: 'default',
            style: { stroke: '#ff6b6b', strokeWidth: 2 },
            animated: true,
          }}
        >
          <Background color="#374151" gap={20} size={1} variant="dots" />
          <Controls className="bg-gray-800 border-gray-700 shadow-lg" position="bottom-right" />
          <MiniMap
            nodeColor="#4F46E5"
            nodeStrokeWidth={3}
            className="bg-gray-800 border-gray-700 shadow-lg"
            position="bottom-left"
            pannable
            zoomable
          />
          
          {/* DEBUG PANEL */}
          {debugInfo && (
            <Panel position="top-center" className="bg-blue-900/90 border border-blue-500/50 rounded-lg p-3 shadow-lg">
              <div className="text-blue-200 text-sm font-mono">
                🔧 DEBUG: {debugInfo}
              </div>
            </Panel>
          )}

          {/* EMPTY STATE */}
          {nodes.length === 0 && (
            <Panel position="center" className="text-center pointer-events-none">
              <div className="bg-gray-800 border-2 border-dashed border-gray-600 p-8 rounded-lg shadow-xl">
                <h3 className="text-xl font-semibold text-gray-300 mb-2">Start Building Your Pipeline</h3>
                <p className="text-gray-500 mb-4">Click "Add Node" to create your first node</p>
                <button
                  onClick={addNode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-all duration-200 hover:scale-105 shadow-lg pointer-events-auto"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add First Node
                </button>
              </div>
            </Panel>
          )}

          {/* CONNECTION HELP */}
          {nodes.length >= 2 && edges.length === 0 && (
            <Panel position="top-left" className="bg-yellow-900/80 border border-yellow-500/50 rounded-lg p-4 shadow-lg">
              <div className="text-yellow-200 text-sm">
                <div className="font-semibold mb-2">🔗 How to Connect Nodes:</div>
                <div>1. Drag FROM the <span className="text-red-300 font-bold">RED circle</span> (right side)</div>
                <div>2. Drag TO the <span className="text-green-300 font-bold">GREEN circle</span> (left side)</div>
                <div className="mt-2 text-yellow-300">Try it now! 👆</div>
              </div>
            </Panel>
          )}

          {/* SELECTION INFO */}
          {(selectedNodes.length > 0 || selectedEdges.length > 0) && (
            <Panel position="top-right" className="bg-gray-800 border border-gray-700 rounded-lg p-2 shadow-lg">
              <div className="flex items-center space-x-2 text-white text-sm">
                <span>
                  {selectedNodes.length > 0 && `${selectedNodes.length} node(s)`}
                  {selectedNodes.length > 0 && selectedEdges.length > 0 && ', '}
                  {selectedEdges.length > 0 && `${selectedEdges.length} edge(s)`}
                  {' '}selected
                </span>
                <span className="text-gray-400">• Press Delete to remove</span>
              </div>
            </Panel>
          )}
        </ReactFlow>

        {showJSON && (
          <JSONPreview 
            nodes={nodes} 
            edges={edges} 
            onClose={() => setShowJSON(false)} 
          />
        )}
      </div>
    </div>
  );
};

const PipelineEditor: React.FC = () => {
  return (
    <ReactFlowProvider>
      <PipelineEditorContent />
    </ReactFlowProvider>
  );
};

export default PipelineEditor;