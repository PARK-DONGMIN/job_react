import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import SimpleModal from '../SimpleModal';
import { useUserStore } from '../../store/store';

const Posts_Delete = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 0);
  const word = searchParams.get('word') ?? '';

  const { postId } = useParams();
  const grade = useUserStore((state) => state.grade);
  const userId = useUserStore((state) => state.userid);

  // ----------------------------------------------------------------
  // modal
  // ----------------------------------------------------------------
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

  // ----------------------------------------------------------------

  const [cate, setCate] = useState({});
  const [input, setInput] = useState({
    postId: 0,
    title: '',
    password: '',
    file1: '',
    file1saved: '',
  });

  // 게시글 조회
  useEffect(() => {
    axiosInstance
      .get(`/posts/read/${postId}`)
      .then((res) => {
        const data = res.data;

        setInput({
          postId: data.postId,
          title: data.title || '',
          password: '',
          file1: data.file1,
          file1saved: data.file1saved,
        });

        return axiosInstance.get(`/cate/${data.cateno}`);
      })
      .then((res) => setCate(res.data))
      .catch((err) => console.error(err));
  }, [postId]);

  const onChange = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  // 삭제 요청
  const send_delete = async (e) => {
    e.preventDefault();

    try {
      const params = {
        postId: input.postId,
      };

      // 관리자면 password 없이 requestUserId 사용
      if (grade === 2) {
        params.requestUserId = userId;
      } else {
        params.password = input.password;
      }

      const response = await axiosInstance.post('/posts/delete', null, {
        params,
      });

      const result = Number(response.data);

      if (result === 1) {
        openModal({
          title: '삭제 성공',
          message: '게시글이 삭제되었습니다.',
          onConfirm: () =>
            navigate(`/posts/list/${cate.cateno}?page=${page}&word=${word}`),
        });
      } else if (result === 2) {
        openModal({
          title: '패스워드 오류',
          message: '패스워드가 일치하지 않습니다.',
        });
      } else {
        openModal({
          title: '삭제 실패',
          message: '삭제에 실패했습니다.',
        });
      }
    } catch (err) {
      console.error(err);
      openModal({
        title: '서버 오류',
        message: '삭제 중 오류가 발생했습니다.',
      });
    }
  };

  const isImage = (file = '') =>
    ['jpg', 'jpeg', 'png', 'gif'].some((ext) =>
      file.toLowerCase().endsWith(ext)
    );

  return (
    <div className="content">
      <div className="title_line_left">
        {cate.grp} &gt; {cate.name}
      </div>

      <aside className="aside_right">
        <Link to={`/posts/create/${cate.cateno}`}>등록</Link>
        <span className="aside_menu_divide">|</span>
        <Link to={`/cate/${cate.cateno}?page=${page}&word=${word}`}>
          목록
        </Link>
      </aside>

      <div className="aside_menu_line"></div>

      <fieldset className="fieldset_basic">
        <div style={{ textAlign: 'center' }}>
          {isImage(input.file1) && (
            <img
              src={`http://localhost:9100/posts/storage/${input.file1saved}`}
              alt=""
              style={{ width: '40%', marginBottom: '20px' }}
            />
          )}

          <h3>{input.title}</h3>

          <p style={{ color: 'red', margin: '20px 0' }}>
            삭제하면 복구할 수 없습니다. 정말 삭제하시겠습니까?
          </p>

          {/* 작성자만 패스워드 입력 */}
          {grade !== 2 && (
            <>
              <label>패스워드</label>
              <input
                type="password"
                id="password"
                value={input.password}
                onChange={onChange}
                className="form-control"
                required
                style={{ width: '300px', margin: '0 auto 20px' }}
              />
            </>
          )}

          <button
            className="btn btn-outline-danger btn-sm"
            onClick={send_delete}
            style={{ marginRight: '10px' }}
          >
            삭제
          </button>

          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() =>
              navigate(-1)
            }
          >
            취소
          </button>
        </div>
      </fieldset>

      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm || closeModal}
        onClose={modal.onConfirm || closeModal}
      />
    </div>
  );
};

export default Posts_Delete;
