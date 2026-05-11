'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ColorContrastChecker() {
  const [foreground, setForeground] = useState('#ffffff');
  const [background, setBackground] = useState('#000000');
  const [ratio, setRatio] = useState(0);
  const [isValid, setIsValid] = useState(false);
  const [aaNormal, setAANormal] = useState(false);
  const [aaLarge, setAALarge] = useState(false);
  const [aaaNormal, setAAANormal] = useState(false);
  const [aaaLarge, setAAALarge] = useState(false);

  const calculateContrast = () => {
    const rgb1 = hexToRgb(foreground);
    const rgb2 = hexToRgb(background);
    if (!rgb1 || !rgb2) {
      setRatio(0);
      setIsValid(false);
      setAANormal(false);
      setAALarge(false);
      setAAANormal(false);
      setAAALarge(false);
      return;
    }
    const lum1 = relativeLuminance(rgb1.r, rgb1.g, rgb1.b);
    const lum2 = relativeLuminance(rgb2.r, rgb2.g, rgb2.b);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    const contrastRatio = (lighter + 0.05) / (darker + 0.05);
    setRatio(Number(contrastRatio.toFixed(2)));
    setIsValid(true);
    setAANormal(contrastRatio >= 4.5);
    setAALarge(contrastRatio >= 3);
    setAAANormal(contrastRatio >= 7);
    setAAALarge(contrastRatio >= 4.5);
  };

  const hexToRgb = (hex: string) => {
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        }
      : null;
  };

  const relativeLuminance = (r: number, g: number, b: number) => {
    const [rs, gs, bs] = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'foreground') setForeground(value);
    if (name === 'background') setBackground(value);
    if (value) calculateContrast();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Color Contrast Checker</h1>
        <p className="text-gray-600 mb-4">
          Check if your text and background color combination meets WCAG accessibility guidelines for contrast.
        </p>
        
        <div className="grid gap-6 mb-6">
          <div>
            <label className="block text-gray-700 font-medium mb-2">Foreground Color (Text)</label>
            <input
              type="color"
              name="foreground"
              value={foreground}
              onChange={handleChange}
              className="w-16 h-10 p-1 border rounded"
            />
            <input
              type="text"
              value={foreground}
              onChange={handleChange}
              name="foreground"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#ffffff"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 font-medium mb-2">Background Color</label>
            <input
              type="color"
              name="background"
              value={background}
              onChange={handleChange}
              className="w-16 h-10 p-1 border rounded"
            />
            <input
              type="text"
              value={background}
              onChange={handleChange}
              name="background"
              className="mt-2 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="#000000"
            />
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded" style={{ backgroundColor: foreground }}></div>
              <span className="font-medium">Foreground: {foreground}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded" style={{ backgroundColor: background }}></div>
              <span className="font-medium">Background: {background}</span>
            </div>
          </div>
          {isValid && (
            <div className="text-right space-y-1">
              <span className="text-2xl font-bold text-gray-800">{ratio}</span>
              <span className="text-sm text-gray-500">contrast ratio</span>
            </div>
          )}
        </div>
        
        {isValid && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">WCAG Results</h2>
            <div className="grid gap-3">
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${aaNormal ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <span>AA Normal Text: {aaNormal ? 'Pass' : 'Fail'}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${aaLarge ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <span>AA Large Text: {aaLarge ? 'Pass' : 'Fail'}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${aaaNormal ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <span>AAA Normal Text: {aaaNormal ? 'Pass' : 'Fail'}</span>
              </div>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${aaaLarge ? 'bg-green-500' : 'bg-red-500'} mr-2`}></div>
                <span>AAA Large Text: {aaaLarge ? 'Pass' : 'Fail'}</span>
              </div>
            </div>
          </div>
        )}
        
        {!isValid && (
          <p className="text-gray-500 italic">
            Select colors to see contrast ratio and accessibility compliance.
          </p>
        )}
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <a href="/" className="text-blue-600 hover:text-blue-800">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}