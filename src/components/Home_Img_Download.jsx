import React, { useEffect } from 'react'
import { getIP } from './Tool'

const Home_Img_Download = () => {
  useEffect(() => {
    window.location.href= `http://${getIP()}:9100/home/home_img_download`; 
  }, []);
  
  return (
    <div style={{textAlign: 'center', marginTop: '50px'}}>
      메인 이미지를 다운로드 중입니다.
    </div>
  )
}

export default Home_Img_Download
