import React, { useEffect, useState } from 'react'
import {useParams, useNavigate, Link, useSearchParams} from 'react-router-dom'
import {enter_chk, axiosInstance, getIP} from '../Tool'
import SimpleModal from '../SimpleModal';

const Contents_Update_text = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 0);   // 0-base
  const word = searchParams.get('word') ?? '';

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

  const {contentsno, password} = useParams();
  console.log('-> contentsno:', contentsno);

  const [cate, setCate] = useState({});
  const [input, setInput] = useState(
    {
      contentsno:0,
      password: '1234',
      file1:'',
      file1saved:'',      
    }    
  );

  useEffect(
    () => {
      axiosInstance.get(`/contents/read/${contentsno}`)
      .then(result => result.data)
      .then(data => {
        console.log('-> data:', data);
        
        // password는 초기값 사용
        setInput(input => ({
          ...input,
          contentsno: data.contentsno,
          title: data.title || '',
          file1: data.file1,
          file1saved: data.file1saved,
        }));

        axiosInstance.get(`/cate/${data.cateno}`)
        .then(result => result.data)
        .then(data => {
          setCate(data);          
          console.log('-> cate data:', data);
        })
        .catch(err => console.error(err));

      })
      .catch(err => console.error(err));
    }, [contentsno]
  );
 
  // e.target: event가 발생한 태그
  const onChange = (e) => {
    const {id, value} = e.target;
    setInput({...input,  [id]: value});
  }

  // 파일 전송 완료를 기다려야 함으로 동기 통신을 지정
  const send_delete = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('contentsno', input.contentsno);
    formData.append('password', input.password);

    try {
      const response = await axiosInstance.post(`/contents/delete`, formData);
      const result = Number(response.data);
      console.log('서버 응답:', result);

      if (result == 0) {
        openModal({
          title: '삭제 실패',
          message: '삭제에 실패 했습니다. 다시 시도해주세요.',
        });
      } else if (result == 1) {
        openModal({
          title: '삭제 성공',
          message: '삭제를 성공 했습니다.',
          onConfirm: () => navigate(`/contents/list/${cate.cateno}?page=${page}&word=${word}`)
        });
        
      } else if (result == 2) {
        openModal({
          title: '패스워드 일치하지 않음',
          message: '패스워드 일치하지 않습니다. 다시 시도해주세요.',
        });
      } 

    } catch (err) {
      console.error(err);
      openModal({
        title: '네트워크 오류',
        message: '네트워크 오류가 발생했습니다.\n다시 시도해주세요.',
      });
    }
  }

  const isImage = (file1 = "") => {
    return ['jpg', 'jpeg', 'png', 'gif'].some(ext => file1.toLowerCase().endsWith(ext));
  }

  return (
    <div className='content'>
      <div className='title_line_left' >{cate.grp} &gt; {cate.name}</div>
      <aside className='aside_right'>
        <Link to={`/contents/create/${cate.cateno}`}>등록</Link>
        <span className='aside_menu_divide'>|</span>
        <a href='#' onClick={() => location.reload()}>새로고침</a>
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/list/${cate.cateno}?page=${page}&word=${word}`}>목록</Link>
      </aside>
      <div className='aside_menu_line'></div> 

      <fieldset className="fieldset_basic">
        <ul>
          <li className="li_none">
            <div style={{ width: "100%", wordBreak: "break-all" }}>
              {isImage(input.file1) && (
                <img
                  src={`http://${getIP()}:9100/contents/storage/${input.file1saved}`}
                  alt=""
                  style={{ width: "50%", float: "left", marginTop: "0.5%", marginRight: "1%" }}
                />
              )}
            </div>

            <div style={{textAlign: 'left', width: '47%', float: 'left', marginBottom: '60px'}}>
              <div style={{ fontSize: "1.5em", fontWeight: "bold", marginBottom: '30px' }}>{input.title}</div>
              
              <div style={{textAlign: 'center', marginTop: '10px', marginBottom: '20px', color: 'red'}}>
                삭제하면 복구 할 수 없습니다. 삭제하시겠습니까?
              </div> 

              <label>패스워드</label>
              <input
                type="password" name="password" id='password'
                value={input.password} 
                onChange={onChange} required
                onKeyDown={e=>enter_chk(e,'btn_send')}
                className="form-control" style={{ flex: 1 }}
              />
            </div>            
            
            <div style={{ whiteSpace: "pre-wrap", textAlign: 'center' }}>
              <button type="submit" id='btn_send' 
                      className="btn btn-outline-secondary btn-sm" 
                      onClick={(e) => send_delete(e)} style={{marginRight: '5px'}}>
                삭제 진행
              </button>
              <button
                type="button"
                onClick={() => navigate(`/contents/list/${cate.cateno}?page=${page}&word=${word}`)}
                className="btn btn-outline-secondary btn-sm"
              >
                취소
              </button>
            </div>
          </li>

        </ul>
      </fieldset>

      {/* 모달 */}
      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={modal.onConfirm || closeModal}
        onConfirm={modal.onConfirm || closeModal}
      />   
    </div>

  )
}

export default Contents_Update_text
