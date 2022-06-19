import React, { useEffect } from 'react';
import './chatOnline.css'
import { useState } from 'react';


function ChatOnline(onlineUsers) {
     const [users,setUsers]=useState([])
     const PF = 'http://localhost:8000/images/'
   
    useEffect(()=>{
        const getUsers = ()=>{
            //check if online user includes in conversations (onlineUsers.conversations)
        let newOnline = onlineUsers.onlineUsers.map(o=> o.userId)
        let newConversations = onlineUsers.conversations.map(c=>{
            return `${c.members.find(m=> m != onlineUsers.currentUser)}`
        })
        let filterUsers = onlineUsers.allUsers.filter(f=> f._id !== onlineUsers.currentUser)
        let usersWithChats = newOnline.filter(n=> newConversations.includes(n))
        setUsers(filterUsers.filter(r=> usersWithChats.includes(r._id)))
        }
        getUsers()
    },[onlineUsers]) 


    return (
        <div className='chatOnline'>
            {users?.map((u,index)=>{
          return  <div key={index} className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img className='chatOnlineImg' src={u.Image?PF+u.Image:PF+'noAvatar.png'} />
                    <div className="chatOnlineBadge"></div>
                </div>
                <span className="chatOnlineName">{u.Fullname}</span>
            </div>
            })}
            <div className={onlineUsers.onlineUsers.length>1?'no':'yes'}>No users are connected</div>
        </div>
    );
}

export default ChatOnline;