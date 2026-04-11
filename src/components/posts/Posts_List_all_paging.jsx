import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axios';

// 페이지 번호 배열
function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

// 페이지바 생성
function getPageNumbers(totalPages, current) {
  if (totalPages === 0) return [];

  const WIN = 4;
  let start = Math.max(1, current - WIN);
  let end = Math.min(totalPages, current + WIN);

  while (end - start < 8) {
    if (start > 1) start--;
    else if (end < totalPages) end++;
    else break;
  }
  return range(start, end);
}

const Posts_List_all_paging = () => {
  const navigate = useNavigate();
  const { cateno } = useParams();

  // 페이지 상태 (세션 유지)
  const savedPage = Number(sessionStorage.getItem('posts_page') ?? 0);

  const [cate, setCate] = useState({});
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(savedPage);
  const [size] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  // 목록 로드
  const load = async (p) => {
    sessionStorage.setItem('posts_page', p);

    const res = await axiosInstance.get(
      '/posts/list_all_paging',
      { params: { page: p, size, cateno } }
    );

    setItems(res.data.content);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
    setTotalElements(res.data.totalElements);
  };

  useEffect(() => {
    axiosInstance
      .get(`/cate/${cateno}`)
      .then(res => setCate(res.data))
      .catch(console.error);

    load(page);
  }, [cateno]);

  const current1 = page + 1;
  const nums = getPageNumbers(totalPages, current1);

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

      {/* 목록 */}
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
          {items.map(item => (
            <tr
              key={item.postId}
              onClick={() => navigate(`/posts/read/${item.postId}`)}
              style={{ cursor: 'pointer' }}
            >
              <td>
                {item.file1saved && (
                  <img
                    src={`http://localhost:9100/posts/storage/${item.file1saved}`}
                    style={{ width: '200px', height: '150px', objectFit: 'cover' }}
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

      {/* 페이지바 */}
      <div>
        <button
          disabled={page === 0}
          onClick={() => load(page - 1)}
          className="btn btn-light"
        >
          ◀
        </button>

        {nums.map(n => {
          const zeroBase = n - 1;
          const isCurr = n === current1;
          return (
            <button
              key={n}
              onClick={() => load(zeroBase)}
              disabled={isCurr}
              className={`btn ${isCurr ? 'btn-secondary' : 'btn-light'} mx-1`}
            >
              {n}
            </button>
          );
        })}

        <button
          disabled={page + 1 >= totalPages}
          onClick={() => load(page + 1)}
          className="btn btn-light"
        >
          ▶
        </button>

        <div style={{ marginTop: 8, color: '#666' }}>
          page: {current1}/{totalPages} • total: {totalElements}
        </div>
      </div>

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

export default Posts_List_all_paging;
