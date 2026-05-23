import axios from "axios"

const API = axios.create({
 baseURL: "http://localhost:5000/api"
})

API.interceptors.request.use((req)=>{

 const token = localStorage.getItem("token")
// attach token to every request if exists
 if(token){
  req.headers.Authorization = `Bearer ${token}`
 }

 return req
})

export default API