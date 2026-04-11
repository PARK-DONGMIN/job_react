import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { axiosInstance } from '../Tool';
import SimpleModal from '../SimpleModal';

const Employee_Delete = () => {
  const { employeeno } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);

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
  // const closeModal = () => setModal((m) => ({ ...m, show: false }));
  const closeModal = () => navigate('/employee/find_all') // [닫기] 목록으로 이동
  // -------------------------------------------------------------------------------

  useEffect(() => {
    axiosInstance.get(`/employee/read/${employeeno}`)
      .then(result => result.data)
      .then(data => {
        console.log('-> Employee_Delete data:', data);
        setData(data);
      })
      .catch(err => {
        console.error(err);
        openModal({ title: '오류', message: '직원 정보를 불러오지 못했습니다.\n잠시 후 다시 시도해주세요.' });
      });
  }, []); // 최초 1회

  // 삭제 처리
  const send = (e) => {
    e.preventDefault(); // 폼 기본 동작 방지

    axiosInstance.delete(`/employee/delete/${data.employeeno}`, {
    })
    .then(result => result.data)
    .then(data => {
      // 0: 실패, 1: 성공
      if (data === 0) {
        openModal({
          title: '삭제 실패',
          message: '회원 정보 삭제에 실패 했습니다.\n다시 시도해주세요.'
        });
      } else if (data === 1) {
        openModal({
          title: '삭제 완료',
          message: '회원 정보를 삭제 했습니다.',
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

  if (!data) {
    return;
  }

  return (
    <div>
      <div className='title_line'>관리자 삭제</div>
      <form onSubmit={send} style={{ margin: '10px auto', width: '70%', textAlign: 'left' }}>
        <div style={{textAlign: 'center', marginTop: '10px', marginBottom: '10px'}}>삭제할 관리자 정보</div> 
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
        
        <div style={{textAlign: 'center', marginTop: '10px', marginBottom: '20px', color: 'red'}}>
          회원 정보를 삭제하면 복구 할 수 없습니다. 삭제하시겠습니까?
        </div> 
        
        <div style={{ textAlign: 'center' }}>
          <button id='btnSend' type="submit" className="btn btn-primary btn-sm" style={{ marginRight: '10px' }}>
            삭제 진행
          </button>
          <button id='btnTest' type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/employee/find_all')}>
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

export default Employee_Delete;

