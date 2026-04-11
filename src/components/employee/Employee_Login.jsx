// Login + Cookie
import React, {useState} from 'react'
import {enter_chk, axiosInstance} from '../Tool'
import {useGlobalStore} from '../../store/store.js'
import { useNavigate } from 'react-router-dom'
import SimpleModal from '../SimpleModal';

const Employee_Login = () => {
  // -------------------------------------------------------------------------------
  // SimpleModal
  // -------------------------------------------------------------------------------
  // modal state
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const openModal = (payload) => setModal(
    { show: true, title: payload.title, message: payload.message, onConfirm: payload.onConfirm || null }
  );
  const closeModal = () => setModal((m) => ({ ...m, show: false }));
  // -------------------------------------------------------------------------------
  
  const navigate = useNavigate();

  const {setLogin, id, setId, storeId, setStoreId, 
         password, setPassword, storePassword, setStorePassword, 
         employeeno, setEmployeeno, grade, setGrade} = useGlobalStore();

  console.log('-> Cookie 로그인 정보');       
  console.log('-> id:', id);
  console.log('-> storeId:', storeId);
  console.log('-> password:', password);
  console.log('-> storePassword:', storePassword);
  console.log('-> grade:', grade);

  // 상태 객체 사용, 초기값으로 전역 변수 사용
  const [input, setInput] = useState(
    {
      id: id,
      password: password,
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

  // const [storId, setStoreId] = useState(true);
  // const [storePassword, setStorePassword] = useState(true);

  const setStoreIdChange = (e) => {
    if (e.target.checked === true) {
      setStoreId(true);
    } else {
      setStoreId(false);
    }
  }

  const setStorePasswordChange = (e) => {
    if (e.target.checked === true) {
      setStorePassword(true);
    } else {
      setStorePassword(false);
    }
  }

  const test = () => {
    setInput({
      id: 'user1', // 해당하는 변수의 값을 덮어씀    
      password: '1234',
    });
  }

  const send = (e) => {
    e.preventDefault();

    axiosInstance.post(`/employee/login?id=${input.id}&password=${input.password}`)
    .then(result => result.data)
    .then(data => {
      console.log('-> axiosInstance data:' + data);

      if (data.cnt === 1) { // 1: 로그인 성공, 0: 로그인 실패
        setLogin(true); 

        // 아이디 저장 체크 여부 확인
        if (storeId === true) {
          setId(input.id);
          setStoreId(true);
        } else {
          setId('');
          setStoreId(false);
        }

        // 패스워드 저장 체크 여부 확인
        if (storePassword === true) {
          setPassword(input.password);
          setStorePassword(true);
        } else {
          setPassword('');
          setStorePassword(false);
        }

        setEmployeeno(data.employeeno); // 로그인한 회원의 회원 번호
        setGrade(data.grade); // 등급

        navigate('/');
      } else {
        openModal({
          title: '로그인 실패',
          message: '로그인 정보를 다시 입력해주세요.',
        });
      }

    })
    .catch(err => console.error(err));
  }

  return (
    <div>
      <div className='title_line' >관리자 로그인</div>
      <form onSubmit={send} style={{margin:'10px auto', width:'50%', textAlign:'left'}}>
        <div className="mb-3 mt-3">
          <label className="form-label">아이디:</label>
          <input type="text" className="form-control" id="id" placeholder="아이디" autoFocus
                  onKeyDown={e=>enter_chk(e,'password')} onChange={onChange} value={input.id} />
        </div>
        <div className='mb-3 form-check div_row_left'>
          <input type="checkbox" id="storeId" className="form-check-input"
                 onChange={setStoreIdChange} checked={storeId}
                 style={{marginTop: '0px'}} />
          <label className='form-check-label' htmlFor='storeId'>아이디 저장</label>
        </div>        

        <div className="mb-3">
          <label className="form-label">패스워드:</label>
          <input type="password" className="form-control" id="password" placeholder="패스워드"
                 onKeyDown={e=>enter_chk(e,'btnSend')} onChange={onChange} value={input.password} />
        </div>

        <div className='mb-3 form-check div_row_left'>
          <input type="checkbox" id="storePassword" className="form-check-input"
                 onChange={setStorePasswordChange} checked={storePassword}
                 style={{marginTop: '0px'}}  />
          <label className='form-check-label' htmlFor='storePassword'>패스워드 저장</label>
        </div>        

        <div style={{textAlign:'center'}}>
          <button id='btnSend' type="submit" className="btn btn-primary" style={{marginRight:'10px'}}>로그인</button>
          <button id='btnTest' type="button" className="btn btn-primary" onClick={test}>테스트 계정</button>
        </div>
      </form>

      {/* 모달 */}
      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={closeModal}
      />      
    </div>
  )
}

export default Employee_Login
