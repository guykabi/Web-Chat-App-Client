import {useState,useEffect} from 'react'
import axios from 'axios' 
import './connection.css'; 
import { useNavigate } from 'react-router'

const ResetPass = ()=>
{  
  const navigate = useNavigate()
  const [codeReset,setCodeReset]=useState('')
  const [userId,setUserId]=useState('') 
  const [password,setPassword]=useState({})
  const [bool,setBool]=useState(true)
  const [bool2, setBool2]=useState(true)
  const [bool3, setBool3]=useState(true)
  const [bool4, setBool4]=useState(true)

  const [text,setText]=useState('')

    useEffect(()=>
    {
        const getCode = ()=>
        {
           let code =  sessionStorage.getItem('code') 
           let id = JSON.parse(sessionStorage.getItem('userID'))
           setUserId(id[0]._id)
           setCodeReset(code)
        } 
        getCode()
    },[]) 



    const checkCode = (e)=>
    {
       if(e.target.value === codeReset)
       {
           setBool(!bool)
       }
    }  

   const newPass = (e)=>
    { 
          if(e.target.name != 'confirmpassword' )
           {
              const {name,value}=e.target 
              setPassword({...password,[name]:value})
            
           } 
           else
           {
               if(e.target.value === password.Password)
               {
                   setBool2(!bool2)
                   setBool4(false)
               } 
               else{
                   setBool4(true)
               }
           }
        
    } 

    const sendUpdate = async(e)=>
    {
        e.preventDefault() 
        try{

        let {data:res}  = await axios.put("http://localhost:8000/api/login/"+userId,password) 
        if( res === 'Updated')
        {
            setBool3(!bool3)
            setText('Your password changed')
            setTimeout(() => {
              navigate('/')
              }, 2000)
        }

        }catch(err)
        {
            setBool3(!bool3)
            setText('Connection problem...')
        }
        
    }

    return(
        <div className='login'>  
           <h2>Reset password</h2>
               <form onSubmit={sendUpdate}>
                   <input required   type="text" className={bool?'notGreen':'green'} disabled={!bool} onChange={checkCode} placeholder='Enter the code'/>
                   <input required minLength={6}  name='Password' onChange={newPass}  placeholder='new password' type="password" disabled={bool} /> <br /> 
                   <input required  name='confirmpassword' onChange={newPass} placeholder='confirm password' type="password" disabled={bool} /> <br /> 
                   <span className={bool2?'hide2':'show2'}>Confirm!</span> <br />
                   <button disabled={bool4} style={{marginBottom:'15px'}} type='submit'>Reset Password</button> <button onClick={()=>navigate('/')} id='returnBtn'>Return</button>
               </form>  
               <span className={bool3?'hide':'show'}>{text}</span>
        </div>
    )
} 

export default ResetPass