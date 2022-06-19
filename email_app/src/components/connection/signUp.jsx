import {useState} from 'react'
import axios from 'axios' 
import './connection.css'; 
import {useNavigate} from 'react-router-dom' 

const SignUp = ()=>
{ 

    const [bool,setBool]=useState(true) 
    const [bool2,setBool2]=useState(true) 
    const [text,setText]=useState('')
    const [text2,setText2]=useState('')
    const [user,setUser]=useState({}) 
    const navigate = useNavigate()


    const makeUser = (e)=>
    {
       if(e.target.name != 'confirmpassword')
       {
            const {name,value} =e.target 
            setUser({...user,[name]:value})  
       } 
       else 
       {
           if(e.target.value === user.Password)
           {
               setBool(!bool)
           } 
           else{
            setBool(true)
           }
          
       }
    } 

    const sendUser =  async(e)=>
    { 
       e.preventDefault() 
       try{

          const {data:res} =await axios.post("http://localhost:8000/api/login/",user)
          if(res === 'Added Successfully')
          {
            setBool2(!bool2) 
            setText('Sign up accomplished')
            setText2('Nice to have you')
            setTimeout(() => {
                navigate('/')
             }, 4000);
          } 
          else
          { 
              setBool2(!bool2) 
              setText('Something went wrong!')
              setText2('Nice to have you')
              setTimeout(() => {
                navigate('/')
             }, 4000);
          } 
       }catch
         {
              setBool2(!bool2) 
              setText('The connection is not good')
              setText2('Please check your your connection')
              setTimeout(() => {
              navigate('/')
             }, 4000);
        }
    }

    return(
        <div className='login'>  
            <div className={bool2?'show':'hide'}> 
                <h2>Welcome</h2>
                <form onSubmit={sendUser}>
                <input placeholder='Full name' onChange={makeUser} type="text" name="Fullname"/> <br /> 
                <input placeholder='Email' onChange={makeUser} type="text" name="Email"  /><br /> 
                <input placeholder='Username' onChange={makeUser} type="text" name="Username" /> <br /> 
                <input placeholder='Password' onChange={makeUser} type="password" name="Password" /> <br /> 
                <input  className={bool?'notgreen2':'green2'} onChange={makeUser} placeholder='Confirm password' type="password" name="confirmpassword" /> <br /> <br />
                <button disabled={bool} type='submit'>Create</button> &nbsp; <button onClick={()=>navigate('/')} id='returnBtn'>Return</button>
                </form> <br />
            </div> 
            <div className={bool2?'hide':'show'}> 
              <br /> <br /> <br /> <br />
              <h2>{text}</h2>
               <h4>{text2}</h4>
              <br /><br /> <br /><br />
            </div> 
          
        </div>
    )
} 

export default SignUp