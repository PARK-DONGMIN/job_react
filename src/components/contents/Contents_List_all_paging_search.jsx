import React, { useEffect, useState } from 'react'
import {useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { axiosInstance, getIP } from '../Tool';
import {useGlobalStore} from '../../store/store.js'

// 페이지 번호 배열 생성
function range(start, end) {
  const arr = [];
  for (let i = start; i <= end; i++) arr.push(i);
  return arr;
}

/**
 * 페이지바 생성 로직
 * - current: 현재 페이지 (1-base, 즉 화면에 표시되는 번호)
 * - totalPages: 전체 페이지 수
 * - window: 현재 페이지 기준 좌우 4개씩(총 9칸)을 보여줌
 */
function getPageNumbers(totalPages, current) {
  // 전체 페이지가 0이면 페이지바 없음
  if (totalPages === 0) return [];

  const WIN = 4; // 현재 페이지 기준으로 좌우 4칸씩 보여줄 폭

  // 시작번호: 최소 1페이지 이상
  let start = Math.max(1, current - WIN); // 현재 9페이지: 5 페이지 부터 출력    

  // 끝번호: 전체 페이지 수를 넘지 않게 제한
  let end = Math.min(totalPages, current + WIN); // 현재 9페이지: 13 페이지 까지 출력    

  /**
   * 페이지 개수를 최대 9개로 맞추기
   * (예: 1 2 3 4 [5] 6 7 8 9 형태)
   * 
   * end - start < 8  → 현재 표시된 구간이 9개 미만이면
   * start를 앞으로 당기거나(end를 뒤로 늘려서) 9개 유지 시도
   */
  while (end - start < 8) {
    if (start > 1) start--;               // 앞쪽으로 확장
    else if (end < totalPages) end++;     // 뒤쪽으로 확장
    else break;                           // 이미 양쪽 끝이면 종료
  }

  // start ~ end 범위의 숫자 배열 반환
  return range(start, end);
}

const Contents_List_all = () => {
  const {grade, setGrade} = useGlobalStore();

  const [searchParams, setSearchParams] = useSearchParams();

  const initPage = Number(searchParams.get('page') ?? 0);   // 0-base
  const initWord = searchParams.get('word') ?? '';

  const navigate = useNavigate();

  const {cateno} = useParams();
  // console.log('-> cateno:', cateno);

  const [cate, setCate] = useState({});
  const [items, setItems] = useState([]);  // record 집합
  
  const [page, setPage] = useState(initPage); // 현재 페이지, 0-base
  // console.log('-> page state:', page);

  const [size] = useState(2); // 페이지당 레코드수
  const [totalPages, setTotalPages] = useState(0); // 총 페이지수
  const [totalElements, setTotalElements] = useState(0); // 총 레코드수

  const [word, setWord] = useState(initWord); // 검색어

  const load = async (currentPage = page, searchWord = word) => {
    setSearchParams({page: currentPage, word: searchWord});

    const res = await axiosInstance.get('/contents/list_all_paging_search', 
      { params: { page: currentPage, size, cateno, word: searchWord } });
    setItems(res.data.content); // record 배열
    setPage(res.data.page);
    setTotalPages(res.data.totalPages);
    setTotalElements(res.data.totalElements);
  };

  useEffect(() => {
    const initPage = Number(searchParams.get('page') ?? 0);   // 0-base
    const initWord = searchParams.get('word') ?? '';

    setPage(initPage);
    setWord(initWord);

    axiosInstance.get(`/cate/${cateno}`)
    .then(result => result.data)
    .then(data => {
      setCate(data);
      console.log('-> cate data:', data);
    })
    .catch(err => console.error(err));

    load(initPage, initWord); // 최초 1 페이지 로딩
  }, [cateno]); 

  const current1 = page + 1; // 1-base 표시
  const nums = getPageNumbers(totalPages, current1); // 페이지 배열

  const handleSearch = (e) => {
    e.preventDefault();
    load(page, word);
  }

  const handleCancelSearch = (e) => {
    e.preventDefault();
    setPage(0);
    setWord('');
    // load(page, word);  // setter 설정후 바로 사용 안됨  ★★★★★

    load(0, ''); 
  }

  return (
    <div className='content'>
      <div className='title_line_left' >{cate.grp} > {cate.name}</div>
      <aside className="aside_right">
        <Link to={`/contents/create/${cate.cateno}`}>등록</Link>
        <span className='aside_menu_divide'>|</span>
        <a href='javascript: location.reload()'>새로고침</a>
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/list/${cate.cateno}?page=${page}&word=${word}`}>목록형</Link>        
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/list_gallery/${cate.cateno}?page=${page}&word=${word}`}>갤러리형</Link>         
      </aside>

      <form
        onSubmit={handleSearch}
        style={{
          margin: '10px 0',
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          value={word}
          onChange={e => setWord(e.target.value)}
          placeholder="검색어를 입력하세요"
          style={{ padding: '1px 2px', width: '240px', marginRight: '8px' }}
        />
        <button type="submit" className="btn btn-sm btn-secondary" style={{ marginRight: '8px' }}>
          검색
        </button>
        {word && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={handleCancelSearch}
          >
            취소
          </button>
        )}
      </form>

      <div className='aside_menu_line'></div>

      <table className="table table-striped" style={{ width: '100%' }}>
        <colgroup>
          <col style={{ width: '10%' }} />
          <col style={{ width: '90%' }} />
        </colgroup>
        <thead>
          <tr>
            <th className='th_bs'>파일</th>
            <th className='th_bs'>제목</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr
              key={item.contentsno}
              onClick={() => navigate(`/contents/read/${item.contentsno}?page=${page}&word=${word}`)}
              style={{ cursor: 'pointer' }}
            >
              <td className='td_basic'>
                <img src={`http://${getIP()}:9100/contents/storage/${item.file1}`} 
                     style={{width: '200px', height: '150px'}} />
              </td>
              <td className='td_left'>
                <span style={{ fontWeight: 'bold' }}>
                  {item.title} {item.rdate.substring(0, 10)}
                  {' '}
                  {
                   grade < 10 ? (item.emotion == 1 ? '긍정': '부정') : ('')                    
                  }
                </span><br />
                <span>
                  {item.content.length > 160
                    ? item.content.substring(0, 160) + '...'
                    : item.content}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        {/* Prev */}
        <button
          disabled={page === 0}
          onClick={() => load(page - 1)}
          style={{marginRight: 8}}
          className='btn btn-light'
        >
          
        </button>

        {/* 페이지 숫자 */}
        {nums.map(n => {
          const zeroBase = n - 1; // 배열값이 1부터 존재함으로 페이징 계산을 위해 0으로 변경
          const isCurr = n === current1; //n: 1~
          return (
            <button
              key={n}
              onClick={() => load(zeroBase)}
              disabled={isCurr}
              style={{marginRight: 6}}
              className={`btn ${isCurr ? 'btn-secondary': 'btn-light'}`}
            >
              {n}
            </button>
          );
        })}

        {/* Next */}
        <button
          disabled={page + 1 >= totalPages}
          onClick={() => load(page + 1)}
          style={{marginLeft: 8}}
          className='btn btn-light'
        >
          
        </button>

        {/* 부가 정보 */}
        <div style={{marginTop: 8, color: '#666'}}>
          page: {current1}/{totalPages} • total: {totalElements}
        </div>
      </div>

      <div className='bottom_menu'>
        <button
          type='button'
          onClick={() => window.location.reload()}
          className='btn btn-outline-secondary btn-sm'
        >
          새로 고침
        </button>
      </div>
    </div>
  )
}

export default Contents_List_all
