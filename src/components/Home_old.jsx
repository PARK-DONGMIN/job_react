import React, { useState, useEffect } from 'react';
import { getIP } from '../components/Tool';

function Home() {
  const [imgSrc, setImgSrc] = useState(null);
  const [loadError, setLoadError] = useState(false);

  // 이미지가 서버에 존재하는지 확인 과정
  useEffect(() => {
    const url = `http://${getIP()}:9100/home/storage/home.jpg`;
    const img = new Image();
    img.src = url;
    img.onload = () => setImgSrc(url); // 이미지가 서버로부터 로딩되면 imgSrc state에 저장
    img.onerror = () => setLoadError(true);
  }, []);

  return (
    <>
      <h5>Resort 운영 관련 긴급 공지사항을 안내 중입니다.</h5>
      {loadError && (
        <p style={{ color: 'red' }}>이미지를 불러오는 데 실패했습니다.</p>
      )}
      {imgSrc && !loadError && (
        <img
          src={imgSrc}
          alt="home"
          style={{ maxWidth: '40%', height: 'auto', marginTop: '50px' }}
        />
      )}
    </>
  );
}

export default Home;

