import axios from 'axios';

const baseURL = process.env === 'production' ? 'todo' : 'http://localhost:3000/REST/manageSite/';

export default axios.create({
  baseURL,
});
