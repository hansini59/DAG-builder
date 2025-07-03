# Pipeline Editor - DAG Builder

A powerful, interactive React-based Pipeline Editor for creating and managing Directed Acyclic Graphs (DAGs). Built with modern web technologies and featuring a beautiful, production-ready interface.

## 🚀 Live Demo

**[View Live Application](https://chimerical-arithmetic-328273.netlify.app/)**

## ✨ Features

### Core Functionality
- **Interactive Node Creation**: Add custom nodes with personalized labels
- **Visual Connection System**: Drag-and-drop connections between nodes
- **Real-time DAG Validation**: Automatic cycle detection and validation
- **Auto Layout Engine**: Intelligent graph layout using Dagre algorithm
- **JSON Export/Import**: Export pipeline configurations as JSON

### User Experience
- **Beautiful Dark Theme**: Modern, professional interface design
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Keyboard Shortcuts**: Delete selected elements with Delete/Backspace
- **Multi-selection**: Select multiple nodes and edges with Ctrl/Cmd
- **Zoom & Pan Controls**: Navigate large pipelines with ease
- **Mini Map**: Bird's eye view of your entire pipeline

### Visual Feedback
- **Connection Indicators**: Color-coded handles (Green = Input, Red = Output)
- **Validation Status**: Real-time feedback on DAG validity
- **Selection Highlighting**: Clear visual feedback for selected elements
- **Animated Connections**: Smooth, animated edge connections
- **Debug Information**: Helpful tooltips and status messages

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Flow Library**: @xyflow/react (React Flow)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Layout Engine**: Dagre
- **Build Tool**: Vite
- **Deployment**: Netlify

## 🏗️ Project Structure

```
src/
├── components/
│   ├── PipelineEditor.tsx      # Main editor component
│   ├── CustomNode.tsx          # Custom node implementation
│   ├── ValidationStatus.tsx    # DAG validation display
│   └── JSONPreview.tsx         # JSON export modal
├── utils/
│   ├── dagValidation.ts        # DAG validation logic
│   └── autoLayout.ts           # Auto-layout algorithms
├── App.tsx                     # Root application component
├── main.tsx                    # Application entry point
└── index.css                   # Global styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd pipeline-editor-dag-builder
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

## 📖 Usage Guide

### Creating Your First Pipeline

1. **Add Nodes**: Click the "Add Node" button to create your first node
2. **Connect Nodes**: Drag from the red circle (output) to a green circle (input)
3. **Customize**: Double-click nodes to rename them
4. **Layout**: Use "Auto Layout" to organize your pipeline automatically
5. **Export**: Click "JSON" to view and export your pipeline configuration

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Delete selected nodes/edges |
| `Ctrl/Cmd + Click` | Multi-select nodes/edges |
| `Mouse Wheel` | Zoom in/out |
| `Click + Drag` | Pan the canvas |

### Connection Rules

- **Source to Target**: Always connect from red handles (source) to green handles (target)
- **No Self-Loops**: Nodes cannot connect to themselves
- **No Cycles**: The system prevents circular dependencies
- **Multiple Connections**: Nodes can have multiple inputs and outputs

## 🔧 Configuration

### Customizing Node Appearance

Edit `src/components/CustomNode.tsx` to modify:
- Node styling and colors
- Handle positions and appearance
- Node content and layout

### Modifying Validation Rules

Update `src/utils/dagValidation.ts` to:
- Add custom validation logic
- Modify error/warning messages
- Implement domain-specific rules

### Layout Algorithms

Customize auto-layout in `src/utils/autoLayout.ts`:
- Change layout direction (TB, LR, BT, RL)
- Adjust node spacing
- Modify edge styling

## 🎨 Customization

### Themes
The application uses a dark theme by default. To customize colors, modify the Tailwind classes in the components or update `tailwind.config.js`.

### Node Types
Add new node types by:
1. Creating new node components
2. Registering them in the `nodeTypes` object
3. Adding type-specific validation logic

## 🧪 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality
- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting (recommended)

## 🐛 Troubleshooting

### Common Issues

**Connections not appearing:**
- Ensure you're dragging from red (source) to green (target) handles
- Check that both nodes exist and are properly rendered
- Verify no validation errors are preventing connections

**Layout issues:**
- Try the "Auto Layout" feature to reorganize nodes
- Use zoom controls if nodes appear too small/large
- Check browser console for any JavaScript errors

**Performance with large graphs:**
- Consider implementing virtualization for 100+ nodes
- Use the mini-map for navigation in complex pipelines

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

