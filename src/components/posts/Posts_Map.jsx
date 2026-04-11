import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import SimpleModal from '../SimpleModal';

const Posts_Map = () => {
  // -------------------------------------------------------------------
  // Modal
  // -------------------------------------------------------------------
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const openModal = (payload) =>
    setModal({ show: true, ...payload });

  const closeModal = () =>
    setModal(m => ({ ...m, show: false }));

  // -------------------------------------------------------------------
  const navigate = useNavigate();
  const { postId } = useParams();

  const [cate, setCate] = useState({});
  const [input, setInput] = useState({
    postId: 0,
    title: '',
    password: '1234',
    map: '',
  });

  const [mapArray, setMapArray] = useState([]);

  // -------------------------------------------------------------------
  // 1. 게시글 + 카테고리 로딩
  // -------------------------------------------------------------------
  useEffect(() => {
    axiosInstance.get(`/posts/read/${postId}`)
      .then(res => res.data)
      .then(data => {
        setInput(i => ({
          ...i,
          postId: data.postId,
          title: data.title || '',
          map: data.map || '',
        }));

        if (data.map) {
          setMapArray(splitKakaoMapString(data.map));
        }

        return axiosInstance.get(`/cate/${data.cateno}`);
      })
      .then(res => setCate(res.data))
      .catch(console.error);
  }, [postId]);

  // -------------------------------------------------------------------
  // 2. 카카오 지도 렌더링
  // -------------------------------------------------------------------
  useEffect(() => {
    if (mapArray.length !== 3) return;

    const [containerId, timestamp, key] = mapArray;
    const loaderSrc =
      'https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js';

    const ensureScript = () =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${loaderSrc}"]`)) {
          resolve();
          return;
        }
        const s = document.createElement('script');
        s.src = loaderSrc;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });

    ensureScript().then(() => {
      const el = document.getElementById(containerId);
      if (!el) return;

      new window.daum.roughmap.Lander({
        timestamp,
        key,
        mapWidth: '100%',
        mapHeight: '360',
      }).render();
    });
  }, [mapArray]);

  // -------------------------------------------------------------------
  const onChange = e => {
    const { id, value } = e.target;
    setInput(i => ({ ...i, [id]: value }));
  };

  // -------------------------------------------------------------------
  // 지도 수정
  // -------------------------------------------------------------------
  const sendUpdateMap = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);
    formData.append('password', input.password);
    formData.append('map', extractKakaoMapInfo(input.map));

    try {
      const res = await axiosInstance.post('/posts/map', formData);
      const result = Number(res.data);

      if (result === 1) {
        openModal({
          title: '지도 수정 성공',
          message: '지도가 수정되었습니다.',
          onConfirm: () => navigate(`/posts/read/${input.postId}`)
        });
      } else if (result === 2) {
        openModal({
          title: '비밀번호 오류',
          message: '비밀번호가 일치하지 않습니다.'
        });
      } else {
        openModal({
          title: '수정 실패',
          message: '지도 수정에 실패했습니다.'
        });
      }
    } catch {
      openModal({
        title: '네트워크 오류',
        message: '잠시 후 다시 시도하세요.'
      });
    }
  };

  // -------------------------------------------------------------------
  // 지도 삭제
  // -------------------------------------------------------------------
  const sendDeleteMap = async e => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);
    formData.append('password', input.password);
    formData.append('map', '');

    try {
      const res = await axiosInstance.post('/posts/map', formData);
      const result = Number(res.data);

      if (result === 1) {
        openModal({
          title: '지도 삭제 완료',
          message: '지도가 삭제되었습니다.',
          onConfirm: () => navigate(`/posts/read/${input.postId}`)
        });
      } else if (result === 2) {
        openModal({
          title: '비밀번호 오류',
          message: '비밀번호가 일치하지 않습니다.'
        });
      } else {
        openModal({
          title: '삭제 실패',
          message: '지도 삭제에 실패했습니다.'
        });
      }
    } catch {
      openModal({
        title: '네트워크 오류',
        message: '잠시 후 다시 시도하세요.'
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
      </aside>

      <div className="aside_menu_line" />

      {mapArray.length === 3 && (
        <div style={{ margin: '20px auto', width: 670 }}>
          <div
            id={mapArray[0]}
            className="root_daum_roughmap root_daum_roughmap_landing"
          />
        </div>
      )}

      <div style={{ width: 670, margin: '0 auto' }}>
        <h4>{input.title}</h4>

        <textarea
          id="map"
          value={input.map}
          onChange={onChange}
          rows={6}
          className="form-control"
        />

        <label>비밀번호</label>
        <input
          id="password"
          type="password"
          value={input.password}
          onChange={onChange}
          onKeyDown={e => enter_chk(e, 'btn_send')}
          className="form-control"
        />
      </div>

      <div style={{ textAlign: 'center', marginTop: 10 }}>
        <button
          id="btn_send"
          className="btn btn-outline-secondary btn-sm"
          onClick={sendUpdateMap}
        >
          지도 수정
        </button>{' '}
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={sendDeleteMap}
        >
          지도 삭제
        </button>{' '}
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>

      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onConfirm={modal.onConfirm || closeModal}
        onClose={closeModal}
      />
    </div>
  );
};

export default Posts_Map;
