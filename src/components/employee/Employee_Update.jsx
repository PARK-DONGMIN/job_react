import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance, enter_chk, getIP } from '../Tool';
import SimpleModal from '../SimpleModal';

const Employee_Update = () => {
  const { employeeno } = useParams();
  const navigate = useNavigate();

  const [input, setInput] = useState({
    employeeno: 0,
    mname: '',
    id: '',
    grade: 0,
  });

  const [id_msg, setId_msg] = useState('');

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

  const onChange = (e) => {
    const { id, value } = e.target;
    setInput(prev => ({
      ...prev,
      [id]: id === 'grade' ? Number(value) : value,
    }));
  };

  useEffect(() => {
    axiosInstance.get(`/employee/read/${employeeno}`)
      .then(result => result.data)
      .then(data => {
        setInput({
          employeeno: data.employeeno,
          mname: data.mname,
          id: data.id,
          grade: Number(data.grade),
        });
      })
      .catch(err => {
        console.error(err);
        openModal({ title: '오류', message: '직원 정보를 불러오지 못했습니다.\n잠시 후 다시 시도해주세요.' });
      });
  }, [employeeno]); // 최초 1회 + employeeno 변경 시

  const send = (e) => {
    e.preventDefault(); // 폼 기본 동작 방지

    // 중복 아이디 검사 최종 다시 진행
    checkId();

    axiosInstance.put('/employee/update', {
      employeeno: input.employeeno,
      mname: input.mname,
      id: input.id,
      grade: input.grade
    })
    .then(result => result.data)
    .then(data => {
      // 0: 실패, 1: 성공
      if (data === 0) {
        openModal({
          title: '변경 실패',
          message: '회원 정보 변경에 실패 했습니다.\n다시 시도해주세요.'
        });
      } else if (data === 1) {
        setId_msg('');
        openModal({
          title: '변경 완료',
          message: '회원 정보를 변경 했습니다.',
          onConfirm: () => navigate('/employee/find_all') // 확인 누르면 이동
        });
      }
    })
    .catch(err => { 
      console.error(err); 
      // openModal({
      //   title: '변경 실패',
      //   message: '회원 정보 변경에 실패 했습니다.\n다시 시도해주세요.'
      // });    
    });
  };

  const checkId = () => {
    console.log(`-> http://${getIP()}:9100/employee/check_id?id=${input.id}`);
    axiosInstance.get(`/employee/check_id?id=${encodeURIComponent(input.id)}`)
      .then(result => result.data)
      .then(data => {
        if (Number(data) === 0) {
          setId_msg('사용 가능한 아이디 입니다.');
        } else {
          setId_msg('사용 불가능한 아이디 입니다.');
        }
      })
      .catch(err => {
        console.error(err);
        openModal({ title: '오류', message: '아이디 검사 중 오류가 발생했습니다.' });
      });
  };

  return (
    <div>
      <div className='title_line'>관리자 수정</div>
      <form onSubmit={send} style={{ margin: '10px auto', width: '70%', textAlign: 'left' }}>
        <div className="mb-3">
          <label className="form-label">성명</label>
          <input
            type="text"
            className="form-control form-control-sm"
            id="mname"
            placeholder="성명"
            onKeyDown={e => enter_chk(e, 'id')}
            onChange={onChange}
            value={input.mname}
            style={{ width: '50%' }}
            autoFocus
          />
        </div>
        <div>
          <label className="form-label" style={{ marginTop: 0, marginBottom: 0 }}>아이디</label>
          <div className="d-flex justify-content-center">
            <input
              type="text"
              className="form-control form-control-sm"
              id="id"
              placeholder="아이디"
              onKeyDown={e => enter_chk(e, 'btnCheckId')}
              onChange={onChange}
              value={input.id}
              style={{ flex: 1, marginRight: '5px' }}
            />
            <button type='button' id='btnCheckId' onClick={checkId} className='btn btn-primary btn-sm'>
              중복 아이디 검사
            </button>
          </div>
          <span style={{ color: 'blue' }}>{id_msg}</span>
        </div>
        <div className="mb-3">
          <label className="form-label">등급</label>
          <input
            type="number"
            className="form-control form-control-sm"
            id="grade"
            placeholder="등급"
            onKeyDown={e => enter_chk(e, 'btnSend')}
            onChange={onChange}
            value={input.grade}
            style={{ width: '50%' }}
          />
        </div>
        <div style={{ textAlign: 'center' }}>
          <button id='btnSend' type="submit" className="btn btn-primary btn-sm" style={{ marginRight: '10px' }}>
            수정 처리
          </button>
          <button id='btnTest' type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/')}>
            취소
          </button>
        </div>
      </form>

      {/* 모달 */}
      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={modal.onConfirm}
      />
    </div>
  );
};

export default Employee_Update;

