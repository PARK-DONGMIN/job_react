import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';

// 페이지 번호 계산 유틸
function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

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

const Posts_List_all_paging_search_gallery = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initPage = Number(searchParams.get('page') ?? 0);
  const initWord = searchParams.get('word') ?? '';

  const navigate = useNavigate();
  const { cateno } = useParams();

  const [cate, setCate] = useState({});
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(initPage);
  const [size] = useState(8);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [word, setWord] = useState(initWord);

  // 목록 로드
  const load = async (currentPage = page, searchWord = word) => {
    setSearchParams({ page: currentPage, word: searchWord });

    const res = await axiosInstance.get('/posts/list_all_paging_search', {
      params: {
        cateno,
        page: currentPage,
        size,
        word: searchWord,
      },
    });

    setItems(res.data.content);
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
    setTotalElements(res.data.totalElements);
  };

  useEffect(() => {
    axiosInstance
      .get(`/cate/${cateno}`)
      .then((res) => setCate(res.data))
      .catch(console.error);

    load(initPage, initWord);
  }, [cateno]);

  const current1 = page + 1;
  const nums = getPageNumbers(totalPages, current1);

  return (
    <div className="content">
      {/* 애니메이션 CSS */}
      <style>{`
        .fade-slide-down {
          opacity: 0;
          transform: translateY(-20px);
          animation: fadeSlideDown 0.8s ease-out forwards;
        }
        @keyframes fadeSlideDown {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .fade-in {
          opacity: 0;
          animation: fadeIn 0.8s ease-out forwards;
        }
        @keyframes fadeIn {
          to { opacity: 1; }
        }
      `}</style>

      <div className="title_line_left">
        {cate.grp} &gt; {cate.name}
      </div>

      <aside className="aside_right">
        <Link to={`/posts/create/${cate.cateno}`}>등록</Link>
        <span className="aside_menu_divide">|</span>
        <a href="#" onClick={() => location.reload()}>새로고침</a>
        <span className="aside_menu_divide">|</span>
        <Link to={`/posts/list/${cate.cateno}?page=${page}&word=${word}`}>
          목록형
        </Link>
        <span className="aside_menu_divide">|</span>
        <Link to={`/posts/list_gallery/${cate.cateno}?page=${page}&word=${word}`}>
          갤러리형
        </Link>
      </aside>

      {/* 검색 */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          load(0, word);
        }}
        style={{ margin: '10px 0', display: 'flex', justifyContent: 'flex-end' }}
      >
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="검색어 입력"
          style={{ width: '240px', marginRight: '8px' }}
        />
        <button className="btn btn-sm btn-secondary">검색</button>
      </form>

      {/* 카드 그리드 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
          gap: '20px',
          marginTop: '20px',
        }}
      >
        {items.map((item, idx) => (
          <div
            key={item.postId}
            onClick={() =>
              navigate(`/posts/read/${item.postId}?page=${page}&word=${word}`)
            }
            className="fade-slide-down"
            style={{
              border: '1px solid #ddd',
              borderRadius: '10px',
              padding: '10px',
              cursor: 'pointer',
              backgroundColor: '#fff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
              animationDelay: `${idx * 0.1}s`,
            }}
          >
            <img
              src={`http://localhost:9100/posts/storage/${item.file1saved}`}
              alt="thumbnail"
              className="fade-in"
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'contain',
                background: '#f8f9fa',
                borderRadius: '8px',
                display: 'block',
                animationDelay: `${idx * 0.1 + 0.2}s`,
              }}
            />

            <h5 style={{ marginTop: '10px' }}>
              {item.title}{' '}
              <small style={{ color: '#888' }}>
                {item.rdate?.substring(0, 10)}
              </small>
            </h5>

            <p style={{ color: '#555', fontSize: '14px' }}>
              {item.content?.length > 100
                ? item.content.substring(0, 100) + '...'
                : item.content}
            </p>
          </div>
        ))}
      </div>

      {/* 페이지네이션 */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <button
          disabled={page === 0}
          onClick={() => load(page - 1)}
          className="btn btn-light"
        >
          &lt;
        </button>

        {nums.map((n) => {
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
          &gt;
        </button>

        <div style={{ marginTop: '10px', color: '#666' }}>
          page: {current1}/{totalPages} • total: {totalElements}
        </div>
      </div>
    </div>
  );
};

export default Posts_List_all_paging_search_gallery;
