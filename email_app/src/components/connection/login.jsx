import {useState} from 'react'
import axios from 'axios' 
import './connection.css'; 
import {useNavigate} from 'react-router-dom'


const Login = ()=>
{ 
    const navigate = useNavigate()
    const [userReset,setUserReset]=useState({})
    const [toLogin,setToLogin]=useState({})
    const [change,setChange]=useState(true)
    const [change2,setChange2]=useState(true) 
    const [change3,setChange3]=useState(true)
    const [text,setText]=useState('')
    const [text2,setText2]=useState('')
    
   
    const loginObj = (e)=>
    {
        const {name,value}=e.target  
        setToLogin({...toLogin,[name]:value})
    } 

    const loginCheck =async (e)=>
    {
        e.preventDefault()  
        try{
             let {data:res}= await axios.post("http://localhost:8000/api/login/",toLogin)
             if(res === 'User does not exist' || res === 'Invalid password')
             {
                setChange2(false) 
                setText('Incorrect details')
             } 
            else
            {
               setChange2(true) 
               sessionStorage.setItem('auth',JSON.stringify(res.Data))
               sessionStorage.setItem('accessToken',res.accessToken)
               navigate('messanger')
            } 
        }catch{
              setChange2(false)
              setText('Connection problem...')
        }
        
    }

    const toObj = (e) =>
    {
     const {name,value}=e.target 
     setUserReset({...userReset,[name]:value})
    } 

   const sendEmail = async (e)=>
   {  
       e.preventDefault() 
       try{
            let {data:res2} = await axios.post("http://localhost:8000/api/login/",userReset) 
            if(res2 !== 'No matching Email')
             {
                 setChange3(true)
                 sessionStorage.setItem('userID',JSON.stringify(res2)) 
                
                let {data:res}  = await axios.post("http://localhost:8000/api/resetpass/",userReset)
                sessionStorage.setItem('code',res) 
                navigate('reset')
             } 
             else{ 
                 if(res2 === 'No matching Email') 
                 {
                    setChange3(false)
                    setText2(res2)
                 } 
             }
        }catch{
            setChange3(!change3)
            setText2('Connection problem...')
        }

   }

    return(
        <div className='login'> 
                 <h2>Login</h2>
                 <form onSubmit={loginCheck}>
                 <input required placeholder='Username' onChange={loginObj} type="text" name="Username" /> <br /> 
                 <input required placeholder='Password' onChange={loginObj}  type="password" name="Password" /> <br /> 
                 <span className={change2?'hide2':'show2'}>{text}</span> <br />
                 <button type='submit'>Login</button> 
             </form> 

                 <h5 className='orLine'>or</h5> 
                 <button id='signUp' onClick={()=>navigate('signup')}>Sign up</button>
           
             <form onSubmit={sendEmail}>
                 <a onClick={()=>{setChange(!change)}}>Forgot your password?</a><br /> 
                 <div className={change?'hide':'show'}>
                 <input style={{marginBottom:'10px'}}  required placeholder='Enter your email' type="text" onChange={toObj} name="Email"  />
                 <span className={change3?'hide':'show'}>{text2}</span>
                 </div> 
                 <button className={change?'hide':'show'} type='submit'>Reset by email</button> 
             </form> <br />

        </div>
    )
} 

export default Login