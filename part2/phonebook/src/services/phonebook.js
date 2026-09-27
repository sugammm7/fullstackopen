import axios from "axios";

const baseURL = "http://localhost:3001/persons";

const getAll = () => {
  const req = axios.get(baseURL);
  return req.then((res) => res.data);
};

const createNewContact = (newContact) => {
  const req = axios.post(baseURL, newContact);
  return req.then((res) => res.data);
};

const deleteContact = (id) => {
  const req = axios.delete(`${baseURL}/${id}`);
  return req.then(() => {
    console.log("Resource deleted successfully");
  });
};

const updateContact = (id, updatedContact) => {
  const req = axios.put(`${baseURL}/${id}`, updatedContact);
  return req.then((res) => res.data);
};

export default {
  getAll,
  createNewContact,
  deleteContact,
  updateContact,
};
