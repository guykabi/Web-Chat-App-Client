import axios from "axios"; 

const getMessages = async (conId) =>{
    return await axios.get('http://localhost:8000/api/messages/'+conId)
}  
const addMessage =async (message)=>{
    return await axios.post("http://localhost:8000/api/messages/",message)
}

const editMessage =async (messageId,message) =>{
    return await axios.put('http://localhost:8000/api/messages/'+messageId,message)
}
const addConversation = async (con)=>{
    return await axios.post('http://localhost:8000/api/conversations/',con)
} 

const deleteConversation = async (conId)=>{
    return await axios.delete("http://localhost:8000/api/conversations/"+conId)
} 

const getUser =async (userId)=>{
    return await axios.get('http://localhost:8000/api/login/'+userId)
} 

const getAllUsers =async ()=>{
    return await axios.get('http://localhost:8000/api/login')
} 
const checkUser =async (user)=>{
    return await axios.post("http://localhost:8000/api/login/",user)
}

const resetPassword =async (userReset)=>{
    return await axios.post("http://localhost:8000/api/resetpass/",userReset)
}

const editUser =async (userId,obj)=>{
    return await axios.put('http://localhost:8000/api/login/'+userId,obj)
} 

const addImage =async (data)=>{
   return await axios.post("http://localhost:8000/api/upload",data)
}

export  {getMessages,addConversation,
         deleteConversation,getUser,
         getAllUsers,addMessage,
         editUser,checkUser,
         resetPassword,editMessage,addImage}