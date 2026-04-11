import React, { useEffect } from 'react'
import {useGlobalStore} from '../../store/store.js'
import { useNavigate } from 'react-router-dom'

const Employee_Logout = () => {
  const navigate = useNavigate();

  const {setLogin} = useGlobalStore();

  useEffect(
    () => {
      setLogin(false);
      navigate('/');
  }, []);

  return (
    <div>
      Employee_Logout
    </div>
  )
}

export default Employee_Logout
