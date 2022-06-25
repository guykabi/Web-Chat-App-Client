import './massenger.css'
import Conversation from '../conversation/conversation'
import Massgae from '../massage/massgae'
import ChatOnline from '../chatOnline/chatOnline'
import { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import {io} from 'socket.io-client'
import {getMessages,addConversation,getAllUsers,getUser,addMessage,editUser} from '../../utils/utils'



const Massenger = ()=>
{ 
    const navigate = useNavigate()
    const [conversation,setConversation]=useState([])
    const [conversation2,setConversation2]=useState([]) 
    const [users,setUsers]=useState([])
    const [filterUsers,setFilterUsers]=useState([])
    const [currentConversation,setCurrentConversation]=useState(null)
    const [messages,setMessages]=useState([])
    const [newMessage,setNewMessage]=useState("")
    const [arrivalMessage,setArrivalMessage]=useState(null)
    const [onlineUsers,setOnlineUsers]=useState([])
    const [restartCon,setRestartCon]=useState(null)
    const socket =useRef()
    //Authentication details
    //let user = JSON.parse(sessionStorage.getItem('auth'))
    let token =  sessionStorage.getItem('accessToken')
    const [userData,setUserData]=useState(JSON.parse(sessionStorage.getItem('auth')))
    //
    const [bool,setBool]=useState(true)
    const scrollRef = useRef()
    const PF = 'http://localhost:8000/images/'
    const [text,setText]=useState('Write something...')
    const [backGround,setBackGround]=useState(true)
    const [chooseImage,setChooseImage]=useState(true)
    const [selectedImage,setSelectedImage]=useState({})
    const[friendImage,setFriendImage]=useState(null)
    

    useEffect( ()=>{
        const arrival = async()=>{
        const {data:res}=await getMessages(currentConversation?._id)
        arrivalMessage&& currentConversation?.members.includes(arrivalMessage.sender)&&
        setMessages((prev)=>[...prev,res[res.length-1]])
        }
        arrival()
       
    },[arrivalMessage,currentConversation])
   
    useEffect(()=>{
         socket.current?.emit('addUser',userData?._id)
         socket.current?.on("getUsers",users=>{
             setOnlineUsers(users)
         })
    },[])
 
    useEffect(()=>
    {   
        socket.current = (io("ws://localhost:8900"))
        socket.current.on('getMessage',(data)=>{
            setArrivalMessage({
                sender:data.senderId,
                text:data.text,
                createdAt:Date.now()
            })
        })

        const check = async (user)=>
        { 
            try{
                   const {data:res} = await axios.get('http://localhost:8000/api/conversations/'+userData?._id,{
                    headers: {
                      'x-access-token': token 
                      }
                   })
                   if(res != 'No Token Provided')
                   {
                    setConversation(res)
                    setConversation2(res)
                   }

                    const{data:res2}=await getAllUsers()
                          setUsers(res2)
            }catch(err)
            {
                setBool(false) 
            }
           
        }
        check()
    },[])  

    useEffect(()=>
    {
       const getAllMessages =  async()=>
        { 
            if(currentConversation) 
            {
               try{
                 const {data:res}= await getMessages(currentConversation?._id)
                 setMessages(res)
               }catch(err)
                 {
                console.log(err)
                 }
             

            try{
                let friendId = currentConversation.members.find(c=> c != userData._id)
                const {data:res}=await getUser(friendId)
                setFriendImage(res[0])
            }catch(err){
                console.log(err)
            }
        }
        }
        getAllMessages()
    },[currentConversation])
  

    const toUserDetails = ()=>
    {
        navigate('/userdetails/'+userData._id)
    }

    const logOut = () =>
    { 
        sessionStorage.clear() 
        navigate('/')
    } 

    const tryAgain = ()=>
    { 
            window.location. reload()
    } 

  const handleSubmit = async(e)=>
  { 
    
      e.preventDefault()
      const message = {
          sender: userData._id,
          text:newMessage,
          conversationId:currentConversation._id,
          seen:false
      } 
       
      const recieverId = currentConversation.members.find(member=>member !== userData?._id)
      if(message.text.length >0)
      { 
        socket.current.emit('sendMessage',{
            senderId:userData._id,
            recieverId,
            text:newMessage 
        })

      try{
             const {data:res}= await addMessage(message)
             setMessages([...messages,res])
             setNewMessage("")
      }catch(err)
      {
               console.log(err)
      }
    }else{
            setText('Empty message is invalid!')
            setTimeout(()=>{
                setText('Write something...')
            },[2000])
    }
  }
   

  useEffect(()=>
  {
      scrollRef.current?.scrollIntoView({behavior:'smooth'})
  },[messages]) 

  const filter = (e)=>
  { 
      if(e.target.value != null)
      {
          const toFilter = users.filter(user =>{
             return user.Fullname.toLowerCase().includes(e.target.value.toLowerCase())
            })
          setFilterUsers(toFilter)
      } 
      if(e.target.value.length ===0)
       {
          setFilterUsers([])
       }
  } 

   const afterDelete = async ()=>
   {
    try{
        const {data:res2} = await axios.get('http://localhost:8000/api/conversations/'+userData?._id,{
         headers: {
           'x-access-token': token 
            }
         })
         setConversation(res2)
         setCurrentConversation(null)
      }catch(err)
         {
          console.log(err)
         }
   } 

    const searchConversation =(e)=>{
        //Get all users, first filter by name and filter by id using conversations
         let filterUsers =  users.filter(u=> u.Fullname.includes(e.target.value)) 
         let usersId = filterUsers.map(f=> f._id)
         let filterCons = conversation.filter(c=>usersId.includes(c.members[1]))
         setConversation(filterCons)
         if(e.target.value.length === 0){
             setConversation(conversation2) 
         } 
    } 

    const toRefreshCon = ()=>{
        setRestartCon(0)
    } 

    const chooseBackGround =(e)=>{
            let tempData = userData
            tempData.background = e.target.name
            setSelectedImage(tempData)
    }

    const sendBackGround = async () =>{
        try{
            await editUser(userData._id,selectedImage)
            const {data:res2}= await getUser(userData._id)
            setUserData(res2[0])
            sessionStorage.setItem('auth',JSON.stringify(res2[0]));
            setBackGround(!backGround)
            setChooseImage(!chooseImage)
        }catch(err){
            console.log(err)
        }
    } 
    
const cancelBackGround = ()=>{
    setChooseImage(true)
    setUserData(JSON.parse(sessionStorage.getItem('auth')))
}
    
   
     
    return(
        <div> 
            <div style={{textAlign:'center'}} className={bool?'hide':'show'}>
                <h1>Connection problem...</h1> <br />
                <button onClick={tryAgain}>Try again</button> &nbsp;&nbsp;<button onClick={()=>{navigate('/')}}>Login page</button>
            </div>
            <div className={bool?'show':'hide'}>
              <div className='topBar'> 
                   <span className='chatAppSpan'><br />{userData?.Fullname}</span>
                   <input className='searchInput' type="search" onChange={filter}  placeholder='Search users...'  /> 
                   {filterUsers?.length != 0&&(<div className='filterusers'>
                            {filterUsers?.map((user,index)=>
                            {
                               return <div 
                               onClick={async()=>{
                                   let include = conversation?.filter(c=>c.members.includes(user._id))
                                   if(include.length == 0)
                                   {
                                   let obj = {senderId:userData?._id,recieverId:user._id}
                                   try{
                                       const {data:res} = await addConversation(obj) 
                                         if(res === "added!")
                                          { 
                                              try{
                                                 const {data:res2} = await axios.get('http://localhost:8000/api/conversations/'+userData?._id,{
                                                  headers: {
                                                    'x-access-token': token 
                                                     }
                                                  })
                                                  setFilterUsers([])
                                                  setConversation(res2)

                                               }catch(err)
                                                  {
                                                   console.log(err)
                                                  }
                                           }
                                    }catch(err)
                                       {
                                         console.log(err)
                                       } 
                                 }

                               }}
                               className='userDiv'
                                key={index}
                                >{user?.Fullname}</div>
                            })}
                   </div>)} 
                   <div className='imageLogOut'>
                   <img onClick={toUserDetails} className='userImage' src={userData?.Image?PF+userData?.Image:PF+'noAvatar.png'} alt="p" />
                   &nbsp;&nbsp;&nbsp;&nbsp; <span className='logOut' onClick={logOut}>Log out</span>
                   </div>
              </div> 
            <div className='massenger'>
                <div className={chooseImage?"chatMenu":"nochatMenu"}>
                     <div className="chatMenuWrapper">
                         <input type="text" onChange={searchConversation} placeholder='Search friends' className='chatMenuInput' />
                         {conversation?.map((con,index)=> { 
                            return <div key={index} onClick={()=>setCurrentConversation(con)}>
                             <Conversation key={index} restart={restartCon} fromChild={afterDelete}  conversation={con} currentUser={userData?userData:null}/>
                                   </div>
                         })} 
                        
                         
                     </div>
                </div>
                <div className="chatBox">
                   <div className="chatBoxWrapper" style={currentConversation?{backgroundImage:`url(${PF+userData.background})`}:{backgroundImage:null}} >
                       { currentConversation?
                       <>
                      
                       <div className="chatBoxTop" >
                           <span className='dotsOfBackGround' onClick={()=>{setBackGround(!backGround)}}></span>
                           <label htmlFor='file' className={backGround?'noChnage':'changeBackGround'}>
                               <span className={backGround?'noChnage':'changeBackGround2'} onClick={()=>{ setChooseImage(!chooseImage)}} >Choose BackGround</span> 
                               <div className={chooseImage?'nopickImage':'pickImage'}>
                                  <h4> Please select one</h4>
                                         <div><input type='image' value='' onClick={chooseBackGround}   name='Solar-Eruptions.jpg' style={{ backgroundImage: `url(${PF+'Solar-Eruptions.jpg'})`}} /> </div> &nbsp;
                                         <div><input type='image' value='' onClick={chooseBackGround}   name='international.jpg' style={{ backgroundImage: `url(${PF+'international.jpg'})`}} /></div> <br />
                                         <div><input type='image' value='' onClick={chooseBackGround}   name='Andromeda_Galaxy.jpg' style={{ backgroundImage: `url(${PF+'Andromeda_Galaxy.jpg'})`}} /> </div>&nbsp;
                                         <div><input type='image' value='' onClick={chooseBackGround}   name='pillars_2.jpeg' style={{ backgroundImage: `url(${PF+'pillars_2.jpeg'})`}} /></div> <br /> 
                                    <button onClick={sendBackGround}>Set</button> &nbsp; &nbsp;<button onClick={chooseBackGround} name='whiteback.png'>None</button> &nbsp; &nbsp; <button onClick={cancelBackGround}>return</button>
                               </div>
                           </label>
                                  
                                {messages?.map((m,index)=>
                                {
                           
                                  return <div key={index} ref={scrollRef}>
                                        <Massgae  message={m} currentUser={userData} friendImg={friendImage} toRestart={toRefreshCon} own={m.sender === userData._id} />
                                        </div>
                                })}
                          
                           </div>
                       <div className="chatBoxBottom">
                           <textarea 
                            className='chatMassageInput'
                            placeholder={text} 
                            onChange={(e)=>setNewMessage(e.target.value)}
                            value={newMessage}
                           ></textarea>
                           <button onClick={handleSubmit} className='chatSubmitButton'>Send</button>
                       </div></> : <span className='noConversation'>Open conversation to start a chat</span>}
                   </div>
                </div>
                <div className="chatOnLine">
                    <div className="chatOnLineWrapper">
                        <ChatOnline onlineUsers={onlineUsers} allUsers={users} conversations={conversation}  currentUser={userData?._id} />
                    </div>
                </div>
              </div>
            </div>
        </div>
    )
} 

export default Massenger