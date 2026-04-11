import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance, enter_chk } from '../Tool';

const Employee_Update_password = () => {
  const navigate = useNavigate();

  // 상태 객체 사용
  const [input, setInput] = useState(
    {
      password: '1234',
      new_password1: '2222',
      new_password2: '2222',
    }    
  );

  // e.target: event가 발생한 태그
  const onChange = (e) => {
    // 구조분해할당
    const{id, value} = e.target;
    console.log(`-> ${id}: ${value}`);
    setInput({
      ...input,  // input 객체의 값 할당
      [e.target.id]: e.target.value, // 해당하는 변수의 값을 덮어씀    
    });
  } 
  
  const [password_msg, setPassword_msg] = useState('');
  
  const send = (e) => {
    e.preventDefault();

    console.log('-> input.new_password1:', input.new_password1);

    if (input.new_password1 !== input.new_password2) {
      setPassword_msg('입력된 패스워드가 일치하지 않습니다.');
    } else {
      axiosInstance.post('/employee/update_password',
        {
          id: 'user1', // 로그인 기능 구현후 수정 예정
          password: input.password,
          new_password: input.new_password1,
        }
      )
      .then(result => result.data)
      .then(data => {
        // 0: 로그인된 사용자의 패스워드가 일치하지 않습니다.
        // 1: 패스워드를 변경했습니다.
        console.log('-> data:', data);
        if (data === 0) {
          setPassword_msg('패스워드 변경에 실패 했습니다.\n다시 시도해주세요.');
        } else if(data === 1) {
          setPassword_msg('패스워드를 변경 했습니다.');
        } else if(data === 2) {
          setPassword_msg('현재 패스워드가 일치하지 않습니다.\n다시 시도해주세요.');
        }
      })
      .catch(err => console.log(err))
    }

  }

  return (
    <div>
      <div className='title_line' >패스워드 변경</div>
      <form onSubmit={send} style={{margin:'10px auto', width:'50%', textAlign:'left'}}>
        <div className="mb-3">
          <label className="form-label" style={{marginTop: '15px'}}>현재 패스워드</label>
          <input type="password" className="form-control form-control-sm" id="password" placeholder="패스워드"
                  onKeyDown={e=>enter_chk(e,'new_password1')} onChange={onChange} value={input.password}
                  style={{width: '100%'}} />
         </div>
        <div className="mb-3">
          <label className="form-label" style={{marginTop: '15px'}}>새로운 패스워드</label>
          <input type="password" className="form-control form-control-sm" id="new_password1" placeholder="패스워드"
                  onKeyDown={e=>enter_chk(e,'new_password2')} onChange={onChange} value={input.new_password1}
                  style={{width: '100%'}} />
        </div>

        <div className="mb-3">
          <label className="form-label">새로운 패스워드 확인</label>
          <input type="password" className="form-control form-control-sm" id="new_password2" placeholder="패스워드"
                  onKeyDown={e=>enter_chk(e,'btnSend')} onChange={onChange} value={input.new_password2}
                  style={{width: '100%'}} />
        </div>
        
        <div className="mb-3">
          <div style={{color: 'blue'}}>{password_msg}</div>
        </div>       

        <div style={{textAlign:'center'}}>              
          <button id='btnSend' type="submit" className="btn btn-primary btn-sm" style={{marginRight:'10px'}}>패스워드 변경</button>
          <button id='btnTest' type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/')}>취소</button>
        </div>
      </form>
    </div>
  )
}

export default Employee_Update_password
