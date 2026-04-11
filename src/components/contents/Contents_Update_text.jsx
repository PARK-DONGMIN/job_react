import React, { useEffect, useState } from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import {enter_chk, axiosInstance} from '../Tool'
import SimpleModal from '../SimpleModal';

const Contents_Update_text = () => {
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

  const {contentsno} = useParams();
  console.log('-> contentsno:', contentsno);

  const [cate, setCate] = useState({});
  const [input, setInput] = useState(
    {
      contentsno:0,
      title: '',
      content: '',
      word: '',
      password: '1234',
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
          content: data.content || '',
          word: data.word || '',
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
  const send = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('contentsno', input.contentsno);
    formData.append('title', input.title);
    formData.append('content', input.content);
    formData.append('word', input.word);
    formData.append('password', input.password);

    try {
      const response = await axiosInstance.post(`/contents/update_text`, formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // if (response.status === 401) {
      //   alert('업로드 권한이 없습니다.\n관리자로 다시 로그인 해주세요.');
      //   return;
      // } else if (response.status !== 200) {
      //   alert('처리에 실패했습니다.\n다시 시도해주세요.');
      //   return;
      // }

      // const result = await response.text(); // fetch
      const result = Number(response.data); // axios
      console.log('서버 응답:', result);

      if (result == 0) {
        openModal({
          title: '수정 실패',
          message: '글 수정에 실패 했습니다. 다시 시도해주세요.',
        });
      } else if (result == 1) {
        openModal({
          title: '수정 성공',
          message: '글 수정에 성공 했습니다.',
          onConfirm: () => navigate(`/contents/read/${input.contentsno}`)
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

  return (
    <div className='content'>
      <div className='title_line_left' >{cate.grp} &gt; {cate.name}</div>
      <aside className='aside_right'>
        <Link to={`/contents/read/${input.contentsno}`}>조회</Link>
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/create/${cate.cateno}`}>등록</Link>
        <span className='aside_menu_divide'>|</span>
        <a href='#' onClick={() => location.reload()}>새로고침</a>
      </aside>
      <div className='aside_menu_line'></div> 

      {/* 수정 폼 */}
      <form onSubmit={send}>
        <input type="hidden" name="contentsno" value={input.contentsno} />

        {/* 제목 */}
        <div className='input_div'>
          <label className="form-label">제목</label>
          <input type="text" name="title" id='title' value={input.title}
                 onChange={onChange} required autoFocus
                 onKeyDown={e=>enter_chk(e,'content')}
                 className="form-control" style={{ flex: 1 }}
          />
        </div>

        {/* 내용 */}
        <div className='input_div'>
          <label>내용</label>
          <textarea name="content" id='content' 
            value={input.content}
            onChange={onChange} required 
            className="form-control"
            rows={6} style={{ flex: 1 }}
          />
        </div>

        {/* 검색어 */}
        <div className='input_div'>
          <label>검색어</label>
          <input
            type="text" name="word" id='word' 
            value={input.word}
            onChange={onChange} 
            onKeyDown={e=>enter_chk(e,'password')}
            required className="form-control"
            style={{ flex: 1 }}
          />
        </div>

        {/* 패스워드 */}
        <div className='input_div'>
          <label>패스워드</label>
          <input
            type="password" name="password" id='password'
            value={input.password} 
            onChange={onChange} required
            onKeyDown={e=>enter_chk(e,'btn_send')}
            className="form-control" style={{ flex: 1 }}
          />
        </div>

        <div className="content_body_bottom" style={{ textAlign: 'center', marginTop: 10 }}>
          <button type="submit" id='btn_send' 
                  className="btn btn-outline-secondary btn-sm">
            저장
          </button>
          <button
            type="button"
            onClick={() => navigate(`/contents/list/${cate.cateno}`)}
            className="btn btn-outline-secondary btn-sm"
            style={{ marginLeft: '8px' }}
          >
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
        onConfirm={modal.onConfirm || closeModal}
      />   
    </div>

  )
}

export default Contents_Update_text
