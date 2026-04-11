import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import SimpleModal from '../SimpleModal';

const Posts_Update_text = () => {
  /* =========================
     Modal
  ========================= */
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const openModal = (payload) =>
    setModal({
      show: true,
      title: payload.title,
      message: payload.message,
      onConfirm: payload.onConfirm || null,
    });

  const closeModal = () =>
    setModal((m) => ({ ...m, show: false }));

  const navigate = useNavigate();
  const { postId } = useParams();

  const [cate, setCate] = useState({});
  const [input, setInput] = useState({
    postId: 0,
    title: '',
    content: '',
    word: '',
    password: '1234',
  });

  /* =========================
     게시글 + 카테고리 조회
  ========================= */
  useEffect(() => {
    axiosInstance.get(`/posts/read/${postId}`)
      .then(res => res.data)
      .then(data => {
        setInput(prev => ({
          ...prev,
          postId: data.postId,
          title: data.title || '',
          content: data.content || '',
          word: data.word || '',
        }));

        axiosInstance.get(`/cate/${data.cateno}`)
          .then(res => setCate(res.data))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, [postId]);

  /* =========================
     입력 변경
  ========================= */
  const onChange = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  /* =========================
     텍스트 수정 전송
  ========================= */
  const send = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);
    formData.append('title', input.title);
    formData.append('content', input.content);
    formData.append('word', input.word);
    formData.append('password', input.password);

    try {
      const res = await axiosInstance.post(
        `/posts/update_text`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const result = Number(res.data);

      if (result === 0) {
        openModal({
          title: '수정 실패',
          message: '글 수정에 실패했습니다.',
        });
      } else if (result === 1) {
        openModal({
          title: '수정 성공',
          message: '글이 수정되었습니다.',
          onConfirm: () => navigate(`/posts/read/${input.postId}`)
        });
      } else if (result === 2) {
        openModal({
          title: '패스워드 오류',
          message: '패스워드가 일치하지 않습니다.',
        });
      }
    } catch (err) {
      console.error(err);
      openModal({
        title: '네트워크 오류',
        message: '잠시 후 다시 시도해주세요.',
      });
    }
  };

  return (
    <div className='content'>
      <div className='title_line_left'>{cate.grp} &gt; {cate.name}</div>

      <aside className='aside_right'>
        <Link to={`/posts/read/${input.postId}`}>조회</Link>
        <span className='aside_menu_divide'>|</span>
        <Link to={`/posts/create/${cate.cateno}`}>등록</Link>
        <span className='aside_menu_divide'>|</span>
        <a href='#' onClick={() => location.reload()}>새로고침</a>
      </aside>

      <div className='aside_menu_line'></div>

      {/* 수정 폼 */}
      <form onSubmit={send}>
        {/* 제목 */}
        <div className='input_div'>
          <label>제목</label>
          <input
            type="text"
            id="title"
            value={input.title}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        {/* 내용 */}
        <div className='input_div'>
          <label>내용</label>
          <textarea
            id="content"
            rows={6}
            value={input.content}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        {/* 검색어 */}
        <div className='input_div'>
          <label>검색어</label>
          <input
            type="text"
            id="word"
            value={input.word}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        {/* 패스워드 */}
        <div className='input_div'>
          <label>패스워드</label>
          <input
            type="password"
            id="password"
            value={input.password}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        <div style={{ textAlign: 'center', marginTop: 12 }}>
          <button className="btn btn-outline-secondary btn-sm">
            저장
          </button>
          <button
            type="button"
            className="btn btn-outline-secondary btn-sm"
            style={{ marginLeft: 8 }}
            onClick={() => navigate(`/posts/list/${cate.cateno}`)}
          >
            취소
          </button>
        </div>
      </form>

      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={closeModal}
        onConfirm={modal.onConfirm || closeModal}
      />
    </div>
  );
};

export default Posts_Update_text;
