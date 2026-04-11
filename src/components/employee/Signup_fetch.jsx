// /src/components/employee/Signup.jsx
import React, {useState} from 'react'
import {enter_chk, getIP} from '../Tool'

const Signup = () => {
    // 상태 객체 사용
  const [input, setInput] = useState(
    {
      mname: '투투투',
      id: 'user',
      password: '1234',
      password2: '1234',
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

  const test = () => {
    setInput({
      mname: '왕눈이',
      id: 'user1', // 해당하는 변수의 값을 덮어씀    
      password: '1234',
      password2: '1234'
    });
  }

  const [id_msg, setId_msg] = useState('');
  const [password_msg, setPassword_msg] = useState('');

  const checkId = () => {
    console.log(`-> http://${getIP()}:9100/employee/check_id?id=${input.id}`);
    fetch(`http://${getIP()}:9100/employee/check_id?id=${input.id}`, {
      method: 'GET',
    })
    .then(result => result.json())
    .then(data => {
      console.log('-> data:', data);
      if (data == 0) {
        setId_msg('사용 가능한 아이디 입니다.');
      } else {
        setId_msg('사용 불가능한 아이디 입니다.');
      }
    })
    .catch(err => console.error(err))

  }

  const send = () => {
    if (input.password !== input.password2) {
      setPassword_msg('입력된 패스워드가 일치하지 않습니다.');
    } else {
      fetch(`http://${getIP()}:9100/employee/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mname: input.mname,
          id: input.id,
          password: input.password,          
        })
      })
      .then(result => result.json())
      .then(data => {
        console.log('-> data:', data);
      })
      .catch(err => console.error(err))
    }

  }

  return (
    <div>
          <h4>관리자 가입</h4>
          <form onSubmit={send} style={{margin:'10px auto', width:'70%', textAlign:'left'}}>
            <div className="mb-3">
              <label className="form-label">성명</label>
              <input type="text" className="form-control form-control-sm" id="mname" placeholder="성명"
                     onKeyDown={e=>enter_chk(e,'id')} onChange={onChange} value={input.mname}
                     style={{width: '50%'}} autoFocus />
            </div>
            <div>
              <label className="form-label" style={{marginTop: '0px', marginBottom: '0px'}}>아이디</label>
              <div className="d-flex justify-content-center">
                <input type="text" className="form-control form-control-sm" id="id" placeholder="아이디"
                       onKeyDown={e=>enter_chk(e,'btnCheckId')} onChange={onChange} value={input.id} 
                       style={{flex: 1, marginRight: '5px'}} />
                <button type='button' id='btnCheckId' onClick={checkId} 
                        className='btn btn-primary btn-sm'>중복 아이디 검사</button>       
              </div>
              <span style={{color: 'blue'}}>{id_msg}</span>
            </div>
            <div className="mb-3">
              <label className="form-label" style={{marginTop: '15px'}}>패스워드</label>
              <input type="password" className="form-control form-control-sm" id="password" placeholder="패스워드"
                     onKeyDown={e=>enter_chk(e,'password2')} onChange={onChange} value={input.password}
                     style={{width: '50%'}} />
              <span style={{color: 'blue'}}>{password_msg}</span>
            </div>
            <div className="mb-3">
              <label className="form-label">패스워드 확인</label>
              <input type="password" className="form-control form-control-sm" id="password2" placeholder="패스워드"
                     onKeyDown={e=>enter_chk(e,'btnSend')} onChange={onChange} value={input.password}
                     style={{width: '50%'}} />
            </div>            
            <div style={{textAlign:'center'}}>              
              <button id='btnSend' type="submit" className="btn btn-primary btn-sm" style={{marginRight:'10px'}}>회원가입</button>
              <button id='btnTest' type="button" className="btn btn-primary btn-sm" onClick={test}>테스트 계정</button>
            </div>
          </form>
    </div>
  )
}

export default Signup
