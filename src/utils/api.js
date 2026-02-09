import axios from 'axios'   
const url = 'http://127.0.0.1:8000'

export const getEmbeddings = async (repo_url) => {
    const data = {"repo_url": repo_url};
    const response = await axios.post('/api/embeddings', data);
    return response.data;
};

export const getFileContent = async (file_url) => {
    const api=file_url;
    const response = await axios.get(api);
    return response.data;
};

export const gettree = async (data) => {
    const response = await axios.get('/api/gettree', {
        params: data
    });
    return response.data.tree;
};