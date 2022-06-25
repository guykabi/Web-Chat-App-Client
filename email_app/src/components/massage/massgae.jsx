
import './massage.css'
import {format} from 'timeago.js'
import { useEffect, useState } from 'react';
import axios from 'axios';
import {editMessage} from '../../utils/utils'

function Massgae({message, currentUser,own,toRestart,friendImg}) {

const PF = 'http://localhost:8000/images/'     
    useEffect(()=>{
        const checkIfSeen = async () =>{
            
            if(message.seen === false && !own){
                console.log(message)
                message.seen = true
                const {data:res}=await editMessage(message._id,message)
                if(res === 'Updated'){
                    
                    toRestart()
                }
            }
        }
        checkIfSeen()
    },[]) 
    

    return (
        <div className={own?'massage own':'massage'}>
            <div className={own?'massageTop':'hideImg'}>
                <img className='massageImg' src={currentUser?.Image?PF+currentUser?.Image:PF+'noAvatar.png'} />
                <p className='massageText'>{message?.text}</p>
            </div> 
            <div className={own?'hideImg':'massageTop'}>
                <img className='massageImg' src={friendImg?.Image?PF+friendImg?.Image:PF+'noAvatar.png'} />
                <p className='massageText'>{message?.text}</p>
            </div> 
            
            <div className="massageBottom">{format(message?.createdAt)}</div>
            
        </div>
    );
}

export default Massgae;