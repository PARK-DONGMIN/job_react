import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import SimpleModal from '../SimpleModal';


const getIP = () => "localhost";

const Posts_Update_file1 = () => {
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
    password: '',
    file1: '',
    file1saved: '',
  });

  const [file, setFile] = useState(null);

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
          file1: data.file1,
          file1saved: data.file1saved,
        }));

        axiosInstance.get(`/cate/${data.cateno}`)
          .then(res => setCate(res.data))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, [postId]);

  /* =========================
     파일 변경
  ========================= */
  const send_update_file1 = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);
    formData.append('password', input.password);
    if (file) formData.append('file1MF', file);

    try {
      const res = await axiosInstance.post(
        `/posts/update_file1`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );

      const result = Number(res.data);

      if (result === 0) {
        openModal({ title: '파일 수정 실패', message: '다시 시도해주세요.' });
      } else if (result === 1) {
        openModal({
          title: '파일 수정 성공',
          message: '파일이 수정되었습니다.',
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

  /* =========================
     파일 삭제
  ========================= */
  const send_delete_file1 = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);
    formData.append('password', input.password);

    try {
      const res = await axiosInstance.post(`/posts/delete_file1`, formData);
      const result = Number(res.data);

      if (result === 0) {
        openModal({ title: '삭제 실패', message: '다시 시도해주세요.' });
      } else if (result === 1) {
        setInput(prev => ({
          ...prev,
          file1: 'none1.png',
          file1saved: 'none1.png',
        }));
        openModal({
          title: '삭제 성공',
          message: '파일이 삭제되었습니다.',
          onConfirm: () => navigate(`/posts/read/${input.postId}`)
        });
      } else if (result === 2) {
        openModal({ title: '패스워드 오류', message: '패스워드 불일치' });
      } else if (result === 3) {
        openModal({ title: '삭제 불가', message: '기본 이미지는 삭제할 수 없습니다.' });
      }
    } catch (err) {
      console.error(err);
      openModal({
        title: '네트워크 오류',
        message: '잠시 후 다시 시도해주세요.',
      });
    }
  };

  const isImage = (file1 = '') =>
    ['jpg', 'jpeg', 'png', 'gif'].some(ext =>
      file1.toLowerCase().endsWith(ext)
    );

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

      <fieldset className="fieldset_basic">
        <ul>
          <li className="li_none">
            {isImage(input.file1) && (
              <img
                src={`http://${getIP()}:9100/posts/storage/${input.file1saved}`}
                alt=""
                style={{ width: '50%', float: 'left', marginRight: '1%' }}
              />
            )}

            <div style={{ width: '47%', float: 'left' }}>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: 30 }}>
                {input.title}
              </div>

              <input
                type="file"
                className="form-control"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />

              <label>패스워드</label>
              <input
                type="password"
                id="password"
                value={input.password}
                onChange={(e) =>
                  setInput({ ...input, password: e.target.value })
                }
                className="form-control"
              />
            </div>

            <div style={{ textAlign: 'center', marginTop: 30 }}>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={send_update_file1}
              >
                파일 변경 처리
              </button>{' '}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={send_delete_file1}
              >
                파일 삭제
              </button>{' '}
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => navigate(`/posts/list/${cate.cateno}`)}
              >
                취소
              </button>
            </div>
          </li>
        </ul>
      </fieldset>

      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={modal.onConfirm || closeModal}
        onConfirm={modal.onConfirm || closeModal}
      />
    </div>
  );
};

export default Posts_Update_file1;
