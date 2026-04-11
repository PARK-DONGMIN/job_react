import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useGlobalStore } from './store/store.js';
import { axiosInstance } from './components/Tool';

function Menu() {
  const { login } = useGlobalStore();
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    axiosInstance.get('/cate/menu')
      .then(res => res.data)
      .then(data => setMenu(Array.isArray(data?.main) ? data.main : []))
      .catch(console.error);
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light" style={{height: '30px'}}>
      <div className="container d-flex justify-content-center">
        <ul className="navbar-nav">
          {/* Home */}
          <li className="nav-item">
            <Link className="nav-link" to="/">Home</Link>
          </li>

          {/* 구분자 */}
          <li className="nav-item">
            <span className="nav-link disabled">|</span>
          </li>

          {/* 동적 메뉴 */}
          {menu.map((group, gIdx) => {
            const items = (group.item || []); // 중분류 배열

            const dropdownId = `menuDropdown-${gIdx}`;

            return (
              <React.Fragment key={group.grp ?? gIdx}> {/* group.grp 존재시 사용하거나, undefind, null이면 gIdx 사용 */}
                <li className="nav-item dropdown">
                  <span
                    className="nav-link dropdown-toggle"
                    id={dropdownId}
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    style={{ cursor: 'pointer' }}
                  >
                    {group.grp}
                  </span>
                  <ul
                    className="dropdown-menu dropdown-menu-start text-start"
                    aria-labelledby={dropdownId}
                  >
                    {items.length === 0 && (
                      <li>
                        <span className="dropdown-item text-muted">항목 없음</span>
                      </li>
                    )}

                    {items.map(it => (
                      <li key={it.cateno}>
                        {/* 라우팅 경로는 필요에 맞게 변경하세요 */}
                        <Link className="dropdown-item" to={`/contents/list/${it.cateno}`}>
                          {it.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="nav-item">
                  <span className="nav-link disabled">|</span>
                </li>
              </React.Fragment>
            );
          })}

          {/* 로그인/로그아웃 */}
          <li className="nav-item">
            {login ? (
              <Link className="nav-link" to="/employee/logout">관리자 로그아웃</Link>
            ) : (
              <Link className="nav-link" to="/employee/login">관리자 로그인</Link>
            )}
          </li>

          <li className="nav-item">
            <span className="nav-link disabled">|</span>
          </li>

          {/* 관리자 드롭다운(고정 메뉴) */}
          <li className="nav-item dropdown">
            <span
              className="nav-link dropdown-toggle"
              id="adminDropdown"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ cursor: 'pointer' }}
            >
              관리자
            </span>
            <ul
              className="dropdown-menu dropdown-menu-start text-start"
              aria-labelledby="adminDropdown"
            >
              {login ? (
                <>
                  <li><Link className="dropdown-item" to="/employee/find_all">회원 목록</Link></li>
                  <li><Link className="dropdown-item" to="/cate/list">카테고리</Link></li>
                  <li><Link className="dropdown-item" to="/home_img_upload">메인 이미지 업로드</Link></li>
                  <li><Link className="dropdown-item" to="/home_img_download">메인 이미지 다운로드</Link></li>
                </>
              ) : (
                <li><Link className="dropdown-item" to="/employee/signup">회원 가입</Link></li>
              )}
            </ul>
          </li>

          <li className="nav-item">
            <span className="nav-link disabled">|</span>
          </li>

          {/* 프로그램 정보 */}
          <li className="nav-item">
            <Link className="nav-link" to="/info">프로그램 정보</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Menu;
