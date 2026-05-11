'use client';

import { useState } from 'react';

export default function AIColorContrastChecker() {
  const [foreground, setForeground] = useState('#FFFFFF');
  const [background, setBackground] = useState('#000000');
  const [ratio, setRatio] = useState(0);
  const [aaNormal, setAANormal] = useState(false);
  const [aaLarge, setAALarge] = useState(false);
  const [aaaNormal, setAAANormal] = useState(false);
  const [aaaLarge, setAAALarge] = useState(false);

  const calculateContrast = () => {
    const luminance = (hex: string) => {
      const rgb = hex
        .replace(/^#/, '')
        .match(/.{2}/g)!
        .map((x) => parseInt(x, 16));
      
      const [r, g, b] = rgb.map((v) => {
        const normalized = v / 255;
        return normalized <= 0.03928
          ? normalized / 12.92
          : Math.pow((normalized + 0.055) / 1.055, 2.4);
      });
      
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const lum1 = luminance(foreground);
    const lum2 = luminance(background);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    
    return (lighter + 0.05) / (darker + 0.05);
  };

  const updateContrast = () => {
    const newRatio = calculateContrast();
    setRatio(newRatio);
    setAANormal(newRatio >= 4.5);
    setAALarge(newRatio >= 3);
    setAAANormal(newRatio >= 7);
    setAAALarge(newRatio >= 4.5);
  };

  // Update contrast when colors change
  // Using useEffect would cause infinite loop, so we'll handle it in the onChange handlers

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Color Contrast Checker
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Ensure your designs are accessible by checking color contrast ratios 
            according to WCAG 2.1 guidelines.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid gap-6 md:grid-cols-2">
            {/* Color Pickers */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreground Color
                </label>
                <div className="relative">
                  <input
                    type="color"
                    value={foreground}
                    onChange={(e) => {
                      setForeground(e.target.value);
                      updateContrast();
                    }}
                    className="w-16 h-10 p-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={foreground}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{6}$/.test(val) || val === '') {
                        setForeground(val);
                        updateContrast();
                      }
                    }}
                    placeholder="#FFFFFF"
                    className="mt-2 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="relative">
                  <input
                    type="color"
                    value={background}
                    onChange={(e) => {
                      setBackground(e.target.value);
                      updateContrast();
                    }}
                    className="w-16 h-10 p-1 border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    value={background}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (/^#[0-9A-Fa-f]{6}$/.test(val) || val === '') {
                        setBackground(val);
                        updateContrast();
                      }
                    }}
                    placeholder="#000000"
                    className="mt-2 block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Preview */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-48 h-48 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-4">
                <div className="text-center p-4">
                  <p className="text-lg font-semibold" style={{ color: foreground }}>
                    Sample Text
                  </p>
                  <p className="text-sm text-gray-600">
                    The quick brown fox
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-gray-50 rounded-lg p-4 text-center">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Contrast Ratio
                </p>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {ratio.toFixed(2)}:1
                </p>
                <div className="text-xs text-gray-500">
                  {ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'Fail'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* WCAG Guidelines */}
        <section className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            WCAG 2.1 Contrast Guidelines
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AA Normal Text</h3>
              <p className="text-sm text-gray-600">
                Minimum contrast ratio of 4.5:1 for normal text
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AA Large Text</h3>
              <p className="text-sm text-gray-600">
                Minimum contrast ratio of 3:1 for large text (18pt+ or 14pt+ bold)
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AAA Normal Text</h3>
              <p className="text-sm text-gray-600">
                Enhanced contrast ratio of 7:1 for normal text
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">AAA Large Text</h3>
              <p className="text-sm text-gray-600">
                Enhanced contrast ratio of 4.5:1 for large text
              </p>
            </div>
          </div>
        </section>

        {/* Results */}
        <section className="mt-8 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Accessibility Results
          </h2>
          <div className="space-y-4">
            <div className={`flex items-center p-4 rounded-lg ${aaNormal ? 'bg-green-50' : 'bg-red-50'} border ${aaNormal ? 'border-green-200' : 'border-red-200'}`}>
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                {aaNormal ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">AA Normal Text</p>
                <p className="text-sm text-gray-600">
                  {aaNormal ? 'Pass (≥4.5:1)' : 'Fail (<4.5:1)'}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center p-4 rounded-lg ${aaLarge ? 'bg-green-50' : 'bg-red-50'} border ${aaLarge ? 'border-green-200' : 'border-red-200'}`}>
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                {aaLarge ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">AA Large Text</p>
                <p className="text-sm text-gray-600">
                  {aaLarge ? 'Pass (≥3:1)' : 'Fail (<3:1)'}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center p-4 rounded-lg ${aaaNormal ? 'bg-green-50' : 'bg-red-50'} border ${aaaNormal ? 'border-green-200' : 'border-red-200'}`}>
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                {aaaNormal ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">AAA Normal Text</p>
                <p className="text-sm text-gray-600">
                  {aaaNormal ? 'Pass (≥7:1)' : 'Fail (<7:1)'}
                </p>
              </div>
            </div>
            
            <div className={`flex items-center p-4 rounded-lg ${aaaLarge ? 'bg-green-50' : 'bg-red-50'} border ${aaaLarge ? 'border-green-200' : 'border-red-200'}`}>
              <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">
                {aaaLarge ? (
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </div>
              <div className="ml-3">
                <p className="font-medium text-gray-800">AAA Large Text</p>
                <p className="text-sm text-gray-600">
                  {aaaLarge ? 'Pass (≥4.5:1)' : 'Fail (<4.5:1)'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}