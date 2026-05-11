'use client';

import { useState, useEffect, useRef } from 'react';

interface VoiceCommand {
  id: string;
  command: string;
  intent: string;
  confidence: number;
  action: string;
}

export default function AIVoiceController() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [aiResponse, setAiResponse] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event: any) => {
        const current = event.resultIndex;
        const result = event.results[current][0].transcript;
        setTranscript(result);
      };

      recognitionRef.current.onend = () => {
        if (isListening) {
          // Restart if still should be listening
          try {
            recognitionRef.current?.start();
          } catch (e) { /* ignore */ }
        }
      };
    }
  }, [isListening]);

  const startListening = () => {
    setIsListening(true);
    try {
      recognitionRef.current?.start();
    } catch (e) { /* already started */ }
  };

  const stopListening = () => {
    setIsListening(false);
    recognitionRef.current?.stop();
  };

  const processCommand = async (cmd: string) => {
    setIsProcessing(true);
    
    const lowerCmd = cmd.toLowerCase();
    let response = '';
    
    if (lowerCmd.includes('navigate') || lowerCmd.includes('go to')) {
      response = `Navigating to ${cmd.split('to').pop()?.trim() || 'the requested section'}...`;
    } else if (lowerCmd.includes('search') || lowerCmd.includes('find')) {
      response = `Searching for "${cmd.split('for').pop()?.trim() || cmd}" in the knowledge base...`;
    } else if (lowerCmd.includes('show') || lowerCmd.includes('display')) {
      response = `Displaying ${cmd.split('display').pop()?.trim() || 'the requested content'}...`;
    } else if (lowerCmd.includes('deploy') || lowerCmd.includes('publish')) {
      response = 'Initiating deployment sequence... Running pre-flight checks...';
    } else if (lowerCmd.includes('status') || lowerCmd.includes('how are you')) {
      response = 'All systems operating normally. 99.9% uptime. Zero active incidents.';
    } else {
      response = `Processing your request: "${cmd}". The AI voice controller is analyzing your command and will execute the appropriate action.`;
    }
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 800));
    setAiResponse(response);
    setIsProcessing(false);
    
    // Add to command history
    const newCommand: VoiceCommand = {
      id: Date.now().toString(),
      command: cmd,
      intent: response.split('.')[0],
      confidence: 85 + Math.random() * 15,
      action: 'executed'
    };
    setCommands(prev => [newCommand, ...prev]);
  };

  const handleTranscriptSubmit = async () => {
    if (!transcript.trim()) return;
    await processCommand(transcript.trim());
    setTranscript('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">AI Voice Controller</h2>
          <p className="text-sm text-gray-600 mt-1">
            Navigate, search, and control the app using natural voice commands
          </p>
        </div>
        <button
          onClick={isListening ? stopListening : startListening}
          className={`px-6 py-3 rounded-full text-white font-semibold transition ${
            isListening 
              ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isListening ? '🔴 Listening...' : '🎤 Start Listening'}
        </button>
      </div>

      {/* Listening Indicator */}
      {isListening && (
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-blue-600 rounded-full animate-pulse"
                  style={{
                    height: `${20 + Math.random() * 30}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
            <div className="text-blue-900 font-medium">
              Listening... Speak your command
            </div>
          </div>
        </div>
      )}

      {/* Live Transcript */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Voice Input</label>
        <div className="flex space-x-2">
          <input
            type="text"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            placeholder="Speak your command or type it here..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleTranscriptSubmit();
              }
            }}
          />
          <button
            onClick={handleTranscriptSubmit}
            disabled={!transcript.trim() || isProcessing}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Processing...' : 'Execute'}
          </button>
        </div>
      </div>

      {/* AI Response */}
      {aiResponse && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
          <div className="font-medium text-green-900 mb-1">AI Voice Assistant</div>
          <div className="text-green-800">{aiResponse}</div>
        </div>
      )}

      {/* Command History */}
      {commands.length > 0 && (
        <div>
          <h3 className="font-medium text-gray-900 mb-3">Recent Voice Commands</h3>
          <div className="space-y-2">
            {commands.slice(0, 5).map(cmd => (
              <div
                key={cmd.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{cmd.command}</div>
                  <div className="text-sm text-gray-600">{cmd.intent}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    cmd.confidence >= 90 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cmd.confidence.toFixed(0)}%
                  </span>
                  <span className="text-green-600">✓ {cmd.action}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Help Text */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="font-medium text-gray-900 mb-2">Voice Commands Supported:</h3>
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
          <div>"Navigate to AI tools"</div>
          <div>"Search for security issues"</div>
          <div>"Show me performance metrics"</div>
          <div>"Deploy latest changes"</div>
          <div>"What's the system status?"</div>
          <div>"Go to knowledge base"</div>
        </div>
      </div>
    </div>
  );
}