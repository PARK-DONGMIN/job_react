import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const Posts_List_all = () => {
  const navigate = useNavigate();
  const { cateno } = useParams();

  const [cate, setCate] = useState({});
  const [data, setData] = useState([]);

  useEffect(() => {
    // 카테고리 정보
    axiosInstance
      .get(`/cate/${cateno}`)
      .then(res => setCate(res.data))
      .catch(console.error);

    // 게시글 전체 목록
    axiosInstance
      .get(`/posts/list_all/${cateno}`)
      .then(res => setData(res.data))
      .catch(console.error);
  }, [cateno]);

  return (
    <div className="content">
      <div className="title_line_left">
        {cate.grp} &gt; {cate.name}
      </div>

      <aside className="aside_right">
        <Link to={`/posts/create/${cate.cateno}`}>등록</Link>
        <span className="aside_menu_divide">|</span>
        <a href="#" onClick={() => location.reload()}>새로고침</a>
      </aside>

      <div className="aside_menu_line"></div>

      <table className="table table-striped">
        <colgroup>
          <col style={{ width: '20%' }} />
          <col style={{ width: '80%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>파일</th>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          {data.map(item => (
            <tr
              key={item.postId}
              onClick={() => navigate(`/posts/read/${item.postId}`)}
              style={{ cursor: 'pointer' }}
            >
              <td>
                {item.file1saved && (
                  <img
                    src={`http://localhost:9100/posts/storage/${item.file1saved}`}
                    style={{
                      width: '200px',
                      height: '150px',
                      objectFit: 'cover'
                    }}
                  />
                )}
              </td>
              <td>
                <strong>
                  {item.title}{' '}
                  <span style={{ color: '#888' }}>
                    {item.rdate?.substring(0, 10)}
                  </span>
                </strong>
                <br />
                {item.content?.length > 160
                  ? item.content.substring(0, 160) + '...'
                  : item.content}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="bottom_menu">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="btn btn-outline-secondary btn-sm"
        >
          새로 고침
        </button>
      </div>
    </div>
  );
};

export default Posts_List_all;
