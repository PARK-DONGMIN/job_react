import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../Tool';

const Employee_Read = () => {
  console.log('-> useParams():', useParams());
  const {employeeno} = useParams();
  const [data, setData] = useState(null);
  const navigate = useNavigate(); 

  useEffect(() => {
    axiosInstance.get(`/employee/read/${employeeno}`)
    .then(result => result.data)
    .then(data => {
      console.log('-> axiosInstance data:' + data);
      setData(data);
    })
    .catch(err => console.error(err));
  }, []); // 최초 1회만 실행

  if (!data) {
    return;
  }

  return (
    <div>
      <div className='title_line'>{data.mname + ' 조회'}</div>
      
      <div className="mb-3 div_row">
        <label className="form-label div_row_label">아이디</label>
        <div className='div_row_content'>{data.id}</div>
      </div>
      <div className="mb-3 div_row">
        <label className="form-label div_row_label">성명</label>
        <div className='div_row_content'>{data.mname}</div>
      </div>
      <div className="mb-3 div_row">
        <label className="form-label div_row_label">등급</label>
        <div className='div_row_content'>{data.grade}</div>
      </div>      
      <div className="mb-3 div_row">
        <label className="form-label div_row_label">등록일</label>
        <div className='div_row_content'>{data.rdate}</div>
      </div>
         
      <div style={{textAlign:'center'}}>              
        <button id='btnSend' type="submit" className="btn btn-outline-warning btn-sm" style={{marginRight:'10px'}} 
                onClick={() => navigate(`/employee/update/${data.employeeno}`)}>수정</button>
        <button id='btnTest' type="button" className="btn btn-outline-info btn-sm" 
                onClick={() => navigate('/employee/update_password')}>패스워드 변경</button>
      </div>

    </div>
  )
}

export default Employee_Read
