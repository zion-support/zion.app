'use client';

import { useState, useEffect } from 'react';

interface ResourceMetrics {
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  networkIn: number;
  networkOut: number;
  gpuUtilization?: number;
}

interface OptimizationJob {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  type: 'cpu-tune' | 'memory-optimize' | 'disk-cleanup' | 'network-optimize' | 'gpu-boost';
  priority: 'low' | 'medium' | 'high';
  efficiencyGain: number;
  completionTime: Date |
think