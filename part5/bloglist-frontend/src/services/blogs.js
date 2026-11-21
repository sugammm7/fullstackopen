import axios from 'axios';

const baseUrl = '/api/blogs';
let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = async () => {
  const res = await axios.get(baseUrl);
  return res.data;
};

const create = async (blogData) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.post(baseUrl, blogData, config);
  return res.data;
};

const update = async (id, blogData) => {
  const config = {
    headers: { Authorization: token },
  };

  const res = await axios.put(`${baseUrl / id}`, blogData, config);
  return res.data;
};

export default { getAll, create, update, setToken };
