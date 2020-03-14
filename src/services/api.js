import axios from 'axios';

const api = axios.create({
  baseURL: 'http://my-json-server.typicode.com/mesquini/rocketshoes',
});

export default api;
