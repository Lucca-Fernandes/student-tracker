import axios from 'axios';

const API_URL = 'http://localhost:3001'; 

export const statsApi = {
  async getStudents() {
    const response = await axios.get(`${API_URL}/students`);
    return response.data; 
  },

  async getStudentStats(hostid: string, periodo: string = 'dia') {
    const response = await axios.get(`${API_URL}/stats/${hostid}`, {
      params: { periodo }
    });
    return response.data;
  }
};