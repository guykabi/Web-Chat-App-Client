import logo from './logo.svg';
import './App.css'; 
import {useState} from 'react'
import axios from 'axios' 
import ResetPass from './components/connection/resetPassword';
import Login from './components/connection/login';
import Massenger from '../src/components/MassengerPage/massenger';
import SignUp from './components/connection/signUp';
import UserDetails from './components/UserPage/userDetails';
import {Route,Routes,useNavigate} from 'react-router-dom'


function App() { 

   const [ userReset,setUserEmail]=useState({})
   const [change,setChange]=useState(true) 
   const navigate = useNavigate()
  

   const toObj = (e) =>
   {
     const {name,value}=e.target 
     setUserEmail({...userReset,[name]:value})
   } 

   const sendEmail = async (e)=>
   {  
      e.preventDefault()
      let {data:res}  = await axios.post("http://localhost:8000/api/resetpass/",userReset)
       sessionStorage.setItem('code',res)
      navigate('reset')

   }

  return (
    <div> 
          
          <Routes>
          <Route path='/' element={<Login/>} />
          <Route path='/reset' element={<ResetPass/>} />
          <Route path='/signup' element={<SignUp/>} /> 
          <Route path='/messanger' element={<Massenger/>} />
          <Route path='/userdetails/:id' element={<UserDetails/>} />
          </Routes>
            
            
    </div>
  );
}

export default App;
