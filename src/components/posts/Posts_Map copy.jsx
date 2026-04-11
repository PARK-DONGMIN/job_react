import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import SimpleModal from '../SimpleModal';

const Posts_Map copy = () => {
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
    setModal({
      show: true,
      title: payload.title,
      message: payload.message,
      onConfirm: payload.onConfirm || null,
    });

  const closeModal = () =>
    setModal((m) => ({ ...m, show: false }));

  // -------------------------------------------------------------------

  const navigate = useNavigate();
  const { postId } = useParams();

  const [category, setCategory] = useState({});
  const [input, setInput] = useState({
    postId: 0,
    title: '',
    password: '1234',
    map: '',
  });

  const [mapArray, setMapArray] = useState([]);

  // -------------------------------------------------------------------
  // util (Tool 대체 – 최소 구현)
  // -------------------------------------------------------------------
  const splitKakaoMapString = (map) => {
    if (!map) return [];
    return map.split('/');
  };

  const extractKakaoMapInfo = (map) => map;

  // -------------------------------------------------------------------

  useEffect(() => {
    // 게시글 조회
    axios
      .get(`http://localhost:9100/posts/read/${postId}`)
      .then((res) => {
        const data = res.data;

        setInput((prev) => ({
          ...prev,
          postId: data.postId,
          title: data.title || '',
          map: data.map || '',
        }));

        setMapArray(splitKakaoMapString(data.map));

        return axios.get(
          `http://localhost:9100/categories/${data.cateno}`
        );
      })
      .then((res) => setCategory(res.data))
      .catch((err) => console.error(err));
  }, [postId]);

  // -------------------------------------------------------------------

  const onChange = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  // 지도 수정
  const sendUpdateMap = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);
    formData.append('password', input.password);
    formData.append('map', extractKakaoMapInfo(input.map));

    try {
      const res = await axios.post(
        'http://localhost:9100/posts/map',
        formData
      );

      if (Number(res.data) === 1) {
        openModal({
          title: '성공',
          message: '지도 수정 완료',
          onConfirm: () => navigate(`/community/${input.postId}`),
        });
      } else {
        openModal({
          title: '실패',
          message: '지도 수정 실패',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 지도 삭제
  const sendDeleteMap = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('postId', input.postId);
    formData.append('password', input.password);
    formData.append('map', '');

    try {
      const res = await axios.post(
        'http://localhost:9100/posts/map',
        formData
      );

      if (Number(res.data) === 1) {
        openModal({
          title: '삭제 완료',
          message: '지도 삭제 완료',
          onConfirm: () => navigate(`/community/${input.postId}`),
        });
      } else {
        openModal({
          title: '실패',
          message: '지도 삭제 실패',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (mapArray.length === 0) return null;

  return (
    <div className="content">
      <div className="title_line_left">
        {category.grp} &gt; {category.name}
      </div>

      <aside className="aside_right">
        <Link to={`/community/${input.postId}`}>조회</Link>
      </aside>

      <div style={{ margin: '10px auto', width: '670px' }}>
        <h3>{input.title}</h3>

        <textarea
          id="map"
          value={input.map}
          onChange={onChange}
          className="form-control"
          rows={6}
        />

        <label>패스워드</label>
        <input
          type="password"
          id="password"
          value={input.password}
          onChange={onChange}
          className="form-control"
        />
      </div>

      <div style={{ textAlign: 'center' }}>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={sendUpdateMap}
        >
          지도 수정
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={sendDeleteMap}
        >
          지도 삭제
        </button>
        <button
          className="btn btn-outline-secondary btn-sm"
          onClick={() => navigate(`/community/${input.postId}`)}
        >
          취소
        </button>
      </div>

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

export default Posts_Map copy;
