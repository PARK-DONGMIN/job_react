import React, { useState, useEffect } from 'react';
import { getIP, axiosInstance } from '../components/Tool';

function Home() {
  const [exist, setExist] = useState(false);
  const url = `http://${getIP()}:9100/home/storage/home.jpg`;

  // 이미지가 서버에 존재하는지 확인 과정
  useEffect(() => {
    const existImage = async() => {
      try {
        const response = await axiosInstance.head(url);
        if (response.status == 200) {
          setExist(true);
        }
      } catch(error) {
        console.error(error);
      };
    }

    existImage();

  }, []);

  return (
    <>
      <h5>Resort 운영 관련 긴급 공지사항을 안내 중입니다.</h5>
      {exist ? (
        <img
          src={url}
          alt="home"
          style={{ maxWidth: '40%', height: 'auto', marginTop: '50px' }}
        />
      ) : (
        <div style={{ color: 'red' }}>이미지를 불러오는 데 실패했습니다.</div>
      )}

    </>
  );
}

export default Home;

