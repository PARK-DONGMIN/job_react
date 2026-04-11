import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import SimpleModal from '../SimpleModal';

const Posts_Youtube = () => {
  // -------------------------------------------------------------------
  // modal
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const openModal = ({ title, message, onConfirm }) => {
    setModal({
      show: true,
      title,
      message,
      onConfirm: onConfirm || null,
    });
  };

  const closeModal = () => {
    setModal((m) => ({ ...m, show: false }));
  };
  // -------------------------------------------------------------------

  const navigate = useNavigate();
  const { postId } = useParams();   // ✅ camelCase

  const [cate, setCate] = useState({});
  const [input, setInput] = useState({
    postId: 0,
    title: '',
    password: '',
    youtube: '',
  });

  // -------------------------------------------------------------------
  // 게시글 + 카테고리 조회
  useEffect(() => {
    axiosInstance
      .get(`/posts/read/${postId}`)
      .then((res) => res.data)
      .then((data) => {
        setInput((prev) => ({
          ...prev,
          postId: data.postId,      // ✅ postId
          title: data.title || '',
          youtube: data.youtube || '',
        }));

        return axiosInstance.get(`/cate/${data.cateno}`);
      })
      .then((res) => setCate(res.data))
      .catch((err) => console.error(err));
  }, [postId]);
  // -------------------------------------------------------------------

  const onChange = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  // -------------------------------------------------------------------
  // youtube 수정
  const send_update_youtube = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);   // ✅ postId
    formData.append('password', input.password);
    formData.append('youtube', input.youtube);

    try {
      const res = await axiosInstance.post('/posts/youtube', formData);
      const result = Number(res.data);

      if (result === 1) {
        openModal({
          title: 'Youtube 수정 성공',
          message: 'Youtube가 수정되었습니다.',
          onConfirm: () => navigate(`/posts/read/${input.postId}`),
        });
      } else if (result === 2) {
        openModal({
          title: '비밀번호 오류',
          message: '비밀번호가 일치하지 않습니다.',
        });
      } else {
        openModal({
          title: '수정 실패',
          message: 'Youtube 수정에 실패했습니다.',
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

  // -------------------------------------------------------------------
  // youtube 삭제
  const send_delete_youtube = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);   // ✅ postId
    formData.append('password', input.password);
    formData.append('youtube', '');

    try {
      const res = await axiosInstance.post('/posts/youtube', formData);
      const result = Number(res.data);

      if (result === 1) {
        openModal({
          title: 'Youtube 삭제 성공',
          message: 'Youtube가 삭제되었습니다.',
          onConfirm: () => navigate(`/posts/read/${input.postId}`),
        });
      } else if (result === 2) {
        openModal({
          title: '비밀번호 오류',
          message: '비밀번호가 일치하지 않습니다.',
        });
      } else {
        openModal({
          title: '삭제 실패',
          message: 'Youtube 삭제에 실패했습니다.',
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
  // -------------------------------------------------------------------

  return (
    <div className="content">
      <div className="title_line_left">
        {cate.grp} &gt; {cate.name}
      </div>

      <aside className="aside_right">
        <Link to={`/posts/read/${input.postId}`}>조회</Link>
        <span className="aside_menu_divide">|</span>
        <Link to={`/posts/create/${cate.cateno}`}>등록</Link>
        <span className="aside_menu_divide">|</span>
        <a href="#" onClick={() => location.reload()}>새로고침</a>
      </aside>

      <div className="aside_menu_line"></div>

      <fieldset className="fieldset_basic">
        <ul>
          <li className="li_none">
            {/* 왼쪽 Youtube */}
            <div style={{ width: '50%', float: 'left', marginRight: '1%' }}>
              {input.youtube ? (
                <div style={{ position: 'relative', paddingBottom: '80%', height: 0 }}>
                  <iframe
                    src={`https://www.youtube.com/embed/${getYoutubeId(input.youtube)}`}
                    title="YouTube player"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 'none',
                    }}
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src="/src/assets/images/none1.png"
                  alt=""
                  style={{ width: '100%' }}
                />
              )}
            </div>

            {/* 오른쪽 폼 */}
            <div style={{ width: '47%', float: 'left' }}>
              <div style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '20px' }}>
                {input.title}
              </div>

              <textarea
                id="youtube"
                value={input.youtube}
                onChange={onChange}
                className="form-control"
                rows={6}
              />

              <label>비밀번호</label>
              <input
                type="password"
                id="password"
                value={input.password}
                onChange={onChange}
                onKeyDown={(e) => enter_chk(e, 'btn_update')}
                className="form-control"
              />
            </div>

            {/* 버튼 */}
            <div style={{ textAlign: 'center', marginTop: '20px', clear: 'both' }}>
              <button
                id="btn_update"
                className="btn btn-outline-secondary btn-sm"
                onClick={send_update_youtube}
              >
                Youtube 변경
              </button>

              <button
                className="btn btn-outline-secondary btn-sm"
                style={{ marginLeft: '5px' }}
                onClick={send_delete_youtube}
              >
                Youtube 삭제
              </button>

              <button
                className="btn btn-outline-secondary btn-sm"
                style={{ marginLeft: '5px' }}
                onClick={() => navigate(`/posts/read/${input.postId}`)}
              >
                취소
              </button>
            </div>
          </li>
        </ul>
      </fieldset>

      {/* modal */}
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

export default Posts_Youtube;
