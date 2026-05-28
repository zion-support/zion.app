import { useState } from 'react';

export default function GradientGeneratorPage() {
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [direction, setDirection] = useState('to right');
  const [shape, setShape] = useState<'circle' | 'ellipse'>('ellipse');
  const [size, setSize] = useState<'closest-side' | 'closest-corner' | 'farthest-side' | 'farthest-corner'>('farthest-corner');
  const [position, setPosition] = useState('center');
  const [colorStops, setColorStops] = useState<Array<{color: string; position: string}>>([
    { color: '#ff0000', position: '0%' },
    { color: '#0000ff', position: '100%' }
  ]);
  const [gradientCss, setGradientCss] = useState('');

  const generateGradientCss = () => {
    const css = gradientType === 'linear'
      ? `linear-gradient(${direction}, ${colorStops.map(stop => `${stop.color} ${stop.position}`).join(', ')})`
      : `radial-gradient(${shape} ${size} at ${position}, ${colorStops.map(stop => `${stop.color} ${stop.position}`).join(', ')})`;

    setGradientCss(css);
    return css;
  };

  const addColorStop = () => {
    setColorStops([...colorStops, { color: '#ffffff', position: '50%' }]);
  };

  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) return; // Keep at least 2 stops
    setColorStops(colorStops.filter((_, i) => i !== index));
  };

  const updateColorStop = (index: number, field: 'color' | 'position', value: string) => {
    setColorStops(colorStops.map((stop, i) => 
      i === index ? { ...stop, [field]: value } : stop
    ));
  };

  // Initial generation
  // generateGradientCss();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">CSS Gradient Generator</h1>
      <p className="mb-4">
        Create beautiful CSS gradients with live preview. Supports linear and radial gradients.
      </p>
      
      <div className="border rounded-lg p-6 mb-6">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gradient Type
            </label>
            <div className="flex space-x-3">
              <label className="flex items-center text-slate-600">
                <input
                  type="radio"
                  checked={gradientType === 'linear'}
                  onChange={() => {
                    setGradientType('linear');
                    generateGradientCss();
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                Linear
              </label>
              <label className="flex items-center text-slate-600">
                <input
                  type="radio"
                  checked={gradientType === 'radial'}
                  onChange={() => {
                    setGradientType('radial');
                    generateGradientCss();
                  }}
                  className="h-4 w-4 text-blue-600"
                />
                Radial
              </label>
            </div>
          </div>
          
          {gradientType === 'linear' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Direction
              </label>
              <select
                value={direction}
                onChange={(e) => {
                  setDirection(e.target.value);
                  generateGradientCss();
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="to right">To Right</option>
                <option value="to left">To Left</option>
                <option value="to bottom">To Bottom</option>
                <option value="to top">To Top</option>
                <option value="to bottom right">To Bottom Right</option>
                <option value="to bottom left">To Bottom Left</option>
                <option value="to top right">To Top Right</option>
                <option value="to top left">To Top Left</option>
                <option value="45deg">45 Degrees</option>
                <option value="135deg">135 Degrees</option>
                <option value="225deg">225 Degrees</option>
                <option value="315deg">315 Degrees</option>
              </select>
            </div>
          )}
          
          {gradientType === 'radial' && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Shape
                </label>
                <select
                  value={shape}
                  onChange={(e) => {
                    setShape(e.target.value as 'circle' | 'ellipse');
                    generateGradientCss();
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="circle">Circle</option>
                  <option value="ellipse">Ellipse</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Size
                </label>
                <select
                  value={size}
                  onChange={(e) => {
                    setSize(e.target.value as any);
                    generateGradientCss();
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="closest-side">Closest Side</option>
                  <option value="closest-corner">Closest Corner</option>
                  <option value="farthest-side">Farthest Side</option>
                  <option value="farthest-corner">Farthest Corner</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => {
                    setPosition(e.target.value);
                    generateGradientCss();
                  }}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="center">Center</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="left">Left</option>
                  <option value="right">Right</option>
                  <option value="top left">Top Left</option>
                  <option value="top right">Top Right</option>
                  <option value="bottom left">Bottom Left</option>
                  <option value="bottom right">Bottom Right</option>
                </select>
              </div>
            </>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color Stops
            </label>
            <div className="space-y-3">
              {colorStops.map((stop, index) => (
                <div key={index} className="border p-3 rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    <label className="text-xs font-medium text-slate-600">Color</label>
                    <input
                      type="color"
                      value={stop.color}
                      onChange={(e) => {
                        updateColorStop(index, 'color', e.target.value);
                        generateGradientCss();
                      }}
                      className="h-8 w-10 rounded border border-slate-300"
                    />
                    <input
                      type="text"
                      value={stop.color}
                      onChange={(e) => {
                        updateColorStop(index, 'color', e.target.value);
                        generateGradientCss();
                      }}
                      className="flex-1 px-2 py-1 border border-slate-300 rounded text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onClick={() => removeColorStop(index)}
                      disabled={colorStops.length <= 2}
                      className="text-xs text-red-500 hover:text-red-700"
                      title="Remove color stop"
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <label className="text-xs font-medium text-slate-600">Position</label>
                    <input
                      type="text"
                      value={stop.position}
                      onChange={(e) => {
                        updateColorStop(index, 'position', e.target.value);
                        generateGradientCss();
                      }}
                      className="w-20 px-2 py-1 border border-slate-300 rounded text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0%"
                    />
                    <span className="text-xs text-slate-500">(e.g., 0%, 50%, 100%)</span>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-end">
                <button
                  onClick={addColorStop}
                  className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded hover:bg-blue-100"
                >
                  + Add Color Stop
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="border rounded-lg p-6">
        <div className="space-y-4">
          <div className="border rounded-lg p-4" style={{ 
            backgroundImage: gradientCss,
            minHeight: '200px'
          }}>
            <p className="text-center text-slate-600 pt-8">Gradient Preview</p>
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">
              CSS Code
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`background: ${gradientCss};`}
                readOnly
                className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`background: ${gradientCss};`);
                  alert('Copied to clipboard!');
                }}
                className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 text-xs"
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}