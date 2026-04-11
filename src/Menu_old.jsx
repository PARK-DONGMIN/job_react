import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { useGlobalStore } from './store/store.js'; 

function Menu() {
  const { login } = useGlobalStore();
  console.log('-> login:', login);

  return (
    <nav style={{marginBottom: '20px'}}>
      <Link to="/">Home</Link>{' ㆍ '}
      <Link to="/employee/signup">회원 가입</Link>{' ㆍ '}
      {login === true ? (
        <>
          <Link to="/employee/find_all">회원 목록</Link>{' ㆍ '}
          <Link to="/cate/list">카테고리</Link>{' ㆍ '}
          <Link to="/home_img_upload">메인 이미지 업로드</Link>{' ㆍ '}
          <Link to="/home_img_download">메인 이미지 다운로드</Link>{' ㆍ '}
          <Link to="/employee/logout">관리자 로그아웃</Link>
        </>
      ) : (
        <Link to="/employee/login">관리자 로그인</Link> // 로그아웃 상태일 때 로그인 링크 표시
      )}{' ㆍ '}
      <Link to="/info">프로그램 정보</Link> 

    </nav>
  );
}

export default Menu;

