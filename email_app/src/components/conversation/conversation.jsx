import axios from 'axios';
import React, { useEffect,useState } from 'react';
import './conversation.css'
import {deleteConversation,getUser,getMessages} from '../../utils/utils'

function Conversation({conversation,currentUser,fromChild,restart}) {
 
    const [user,setUser]=useState(null) 
    const [bool,setBool]=useState(true)
    let [count,setCount]=useState(0)
    const PF = 'http://localhost:8000/images/'
    

  useEffect(()=>{
            setCount(0)
  },[restart])



    useEffect(()=>
    {
        const friendId = conversation.members?.find(m=>m !== currentUser._id )
        const getOtherUser = async ()=>
        {
            try{
                  const {data:res} = await getUser(friendId)
                  setUser(res)
            }catch(err)
              {
                  console.log(err)
              }
        }
        getOtherUser()
    
       
    },[conversation])
  
    useEffect(()=>{
        const getSeen = async ()=>{
            const {data:res}= await  getMessages(conversation._id)
            res.forEach(r=> {
                if(r.seen === false && r.sender != currentUser._id){
                      setCount(count+=1)
                }
            })
        }
        getSeen()
           
    },[conversation])
     
  const sureTpDelete = ()=>{
    setBool(false)
  }


    const delteChat = async () =>
    {
        const {data:res}=await deleteConversation(conversation._id)
        setBool(true)
        fromChild()
    } 



    return (
        <div className='conversation'>
            
             <img className='conversationImg' src={user?.[0].Image?PF+user?.[0].Image:PF+'noAvatar.png'} alt="p" />
             <span className='conversationName'>{user?.[0].Fullname}</span> 
             &nbsp;&nbsp;&nbsp;&nbsp; <span  className='deleteX' onClick={sureTpDelete}>x</span>
              &nbsp; {count>0 &&(<p className='count'>{count}</p>)}
             <div className={bool?'hide2':'show2'}>
                    Are you sure to delete? <br />
                    <button className='btnSure' onClick={delteChat}>Yes</button>&nbsp; <button  className='btnSure' onClick={()=>setBool(true)}>No</button>
             </div>
        </div> 
    );
}

export default Conversation;