import axios from 'axios'
// console.log(import.meta.env);
// console.log(import.meta.env.VITE_API_URL);
const api = import.meta.env.VITE_API_URL;
const github=import.meta.env.VITE_GITHUB_TOKEN;


// export const getEmbeddings = async (repo_url,id) => {
//     const data = {"repo_url": repo_url, "user_id": id };
//     const response = await axios.post('/api/embeddings', data);
//     return response.data;
// };

// export const getFileContent = async (file_url) => {
//     const api=file_url;
//     const response = await axios.get(api);
//     return response.data;
// };

// export const gettree = async (data) => {
//     const response = await axios.get('/api/gettree', {
//         params: data
//     });
//     return response.data.tree;
// };

// export const registerfn= async (username,password) => {
//     const data = {"user": username, "password": password};
//     const response = await axios.post('/api/register', data);
//     return response.data;
// }

// export const  getscore= async (repo_id) => {

//     const response = await axios.get('/api/getscore/'+repo_id);

//     return response.data.score;
// }


// export const getrepos= async (user_id) => {

//     const response = await axios.get('/api/repositories/'+user_id);
//     return response.data.repositories;
// }


// export const getthreads= async (repo_id,user_id) => {
//     const response = await axios.get('/api/threads/'+repo_id+'/'+user_id);
//     return response.data.threads;
// }

// export const gethistory= async (thread_id) => {
//     const response = await axios.get('/api/messages/'+thread_id);
//     return response.data.history;
// }


// export  const newchat=async (repo_id,user_id,message) =>{
//     const data = {"repo_id": repo_id, "user_id": user_id, "title": message};
//     const response = await axios.post('/api/newchat', data);
    
//     return response.data.response.data;
// }


// export const getmodel=async()=>{
//     const res=await axios.get('/api/');
// }


// console.log("API URL:", api);

export const getEmbeddings = async (repo_url,id) => {
    const data = {"repo_url": repo_url, "user_id": id };
    const response = await axios.post(`${api}/embeddings`, data);
    return response.data;
};

export const getFileContent = async (file_url) => {
    const l_api=file_url;
    const headers = {
    "Authorization": `Bearer ${github}`,
    "Accept": "application/vnd.github+json"
}
    const response = await axios.get(l_api, { headers });
    console.log(response.headers.get("X-RateLimit-Remaining"));
    return response.data;
};

export const gettree = async (data) => {
    const response = await axios.get(`${api}/gettree`, {
        params: data
    });
    return response.data.tree;
};

export const registerfn= async (username,password) => {
    const data = {"user": username, "password": password};
    const response = await axios.post(`${api}/register`, data);
    return response.data;
}

export const  getscore= async (repo_id) => {

    const response = await axios.get(`${api}/getscore/${repo_id}`);

    return response.data.score;
}


export const getrepos= async (user_id) => {

    const response = await axios.get(`${api}/repositories/${user_id}`);
    return response.data.repositories;
}


export const getthreads= async (repo_id,user_id) => {
    const response = await axios.get(`${api}/threads/${repo_id}/${user_id}`);
    return response.data.threads;
}

export const gethistory= async (thread_id) => {
    const response = await axios.get(`${api}/messages/${thread_id}`);
    return response.data.history;
}


export  const newchat=async (repo_id,user_id,message) =>{
    const data = {"repo_id": repo_id, "user_id": user_id, "title": message};
    const response = await axios.post(`${api}/newchat`, data);
    
    return response.data.response.data;
}


export const getmodel=async()=>{
    const res=await axios.get(`${api}/`);
}
