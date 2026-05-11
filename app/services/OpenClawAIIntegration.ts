import axios from 'axios';

// OpenClaw AI integration service
const openclawAI = {
  getPrediction: async (userId: string) => {
    const response = await axios.get(`/api/ai-integration?userId=${userId}`);
    return response.data;
  },
  sendAnalytics: async (data: any) => {
    // Will be enhanced with agent coordination
    const response = await axios.post('/api/ai-analytics', data);
    return response.status === 200;
  }
};
export default openclawAI;