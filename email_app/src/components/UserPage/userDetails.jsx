import axios from 'axios';
import { useState,useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import './userDetails.css'
import {getUser,addImage,editUser} from '../../utils/utils'

 const UserDetails = () => {
    const {id} = useParams()
    const navigate = useNavigate()
    const [avatar,setAvatar]=useState('https://www.omyoga.co.il/wp-content/themes/hello-elementor/img/no-avatar.png')
    const [user,setUser]=useState({})
    const [ifChange,setIfChange]=useState({})
    const [file,setFile]=useState(null)
    const [bool,setBool]=useState(true)
    const [change,setChange]=useState(true)
    const [change2,setChange2]=useState(true)
    const [change3,setChange3]=useState(true)
    const PF = 'http://localhost:8000/images/'


    useEffect(()=>
    {
        const userData = async()=>
        {
           const {data:res} = await getUser(id)
           setUser(res[0])
           setIfChange(res[0])
        }
        userData()
    },[])

    const changeDetails =  (e)=>
    { 
        if(e.target.files)
        {
        setFile(e.target.files[0])
        }
        const {name,value}=e.target 
        setUser({...user,[name]:value}) 
    } 

    const send = async (e) =>
    { 
        e.preventDefault()
        const obj = {
           _id:user._id,
           Fullname:user.Fullname,
           Email:user.Email,
           Username:user.Username,
           Password:user.Password,
        }
            if(file){
                const data = new FormData()
                const fileName = Date.now() + file.name
                data.append("file",file) 
                data.append("name",fileName)
                obj.Image=fileName
                try{
                   const {data:res2}= await addImage(data)
               }catch(err)
                 {
                   console.log(err)
                 }

             }
             if(!file && user === ifChange){
                setBool(false)
                 setTimeout(()=>{
                    setBool(true)
                 },[2000])
                
             }
        try{
                const {data:res}= await editUser(id,obj)
                
        }catch(err){
              console.log(err)
        }
    } 

    const edit = ()=>{
              setChange(!change)
    }
    const edit2 = ()=>{
        setChange2(!change2)
    }  
    const edit3 = ()=>{
    setChange3(!change3)
    }


    return (
        <div className='userDetails'>
            <div className='formDiv'>
                <form onSubmit={send}>  
                    <div className='userImageDiv'>
                         
                            <input style={{backgroundImage: `url(${user.Image?PF+user.Image:PF+'noAvatar.png'})`}} onChange={changeDetails} 
                            id='customFile'
                            className='fileInput'
                            accept='.jpg,.png,.jpeg'
                            type="file" 
                            name="file" />
                            <label htmlFor="customFile">Click to choose image</label>
                        
                    </div> <br /> 
                      <div className={bool?'nochange':'change'}>
                               You didnt change nothing
                      </div>
                    <div className='detailsform'>
                             <span  onClick={edit} className='pencil'>✏️</span>   <input disabled={change} type="text" className='fullname' defaultValue={user.Fullname} placeholder='Fullname' required name="Fullname" onChange={changeDetails}  /><br />
                             <span onClick={edit2}   className='pencil'>✏️</span>  <input disabled={change2} type="text" defaultValue={user.Email} placeholder='Email' required name="Email"  onChange={changeDetails}  /><br />
                             <span  onClick={edit3}  className='pencil'>✏️</span>  <input disabled={change3} type="text" defaultValue={user.Username} placeholder='Username' required name="Username"  onChange={changeDetails}  /><br />
                            <button className='btnSubmit' type='submit'>Save</button> &nbsp; <button className='btnSubmit' onClick={()=>navigate('/messanger')}>Return</button>
                    </div> 
                   
                 </form>
             </div>
        </div>
    );
}; 

export default UserDetails