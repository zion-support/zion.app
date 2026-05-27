'use client';

export default function MultiWavelengthAIVision() {
  return (
    <div className="p-6 bg-gradient-to-br from-white to-rose-50 rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-rose-900">
            <span className="text-3xl mr-2">👁️</span> Multi-Wavelength AI Vision
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Holistic pattern detection across optical, infrared, quantum, and electromagnetic spectra
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-rose-600 text-white rounded hover:bg-rose-700 transition-colors">
            Analyze Spectrum
          </button>
        </div>
      </div>
      <div className="mt-6 bg-white/70 backdrop-blur rounded-lg p-4">
        <h3 className="font-semibold text-gray-800 mb-2">Vision Capabilities</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li>Optical + infrared fusion imaging</li>
          <li>Quantum photon correlation detection</li>
          <li>Electromagnetic anomaly mapping</li>
          <li>Real-time spectral compression to visible light</li>
        </ul>
      </div>
      <div className="mt-4 flex items-center gap-2 text-rose-600">
        <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Scanning</span>
      </div>
    </div>
  );
}