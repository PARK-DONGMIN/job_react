import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom'
import { axiosInstance, getIP, download, getYoutubeId, splitKakaoMapString } from '../Tool';
import Contents_List_all from './Contents_List_all';

const Contents_Read = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page') ?? 0);   // 0-base
  const word = searchParams.get('word') ?? '';

  const navigate = useNavigate();

  const {contentsno} = useParams();
  console.log('-> contentsno:', contentsno);

  const [cate, setCate] = useState({});
  const [data, setData] = useState({});
  const [map_array, setMap_array] = useState([]);

  useEffect(
    () => {
      axiosInstance.get(`/contents/read/${contentsno}`)
      .then(result => result.data)
      .then(data => {
        setData(data);
        console.log('-> data:', data);

        // ["daumRoughmapContainer1762848321274", "1762848321274", "cz89ag36uw3"]
        setMap_array(splitKakaoMapString(data.map));  


        axiosInstance.get(`/cate/${data.cateno}`)
        .then(result => result.data)
        .then(data => {
          setCate(data);
          console.log('-> cate data:', data);
        })
        .catch(err => console.error(err));

      })
      .catch(err => console.error(err));
    }, [contentsno]
  );

  // 2) 약도 렌더 (map_array가 준비된 뒤 실행)
  useEffect(() => {
    if (map_array.length !== 3) return;

    const [containerId, timestamp, key] = map_array;

    const loaderSrc = "https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js";
    const ensureScript = () =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${loaderSrc}"]`)) return resolve();
        const s = document.createElement("script");
        s.src = loaderSrc;
        s.charset = "UTF-8";
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });

    const renderMap = async () => {
      await ensureScript();

      // 컨테이너가 실제 DOM에 존재하는지 확인
      const el = document.getElementById(containerId);
      if (!el) return;

      // 중복 렌더 방지 (필요 시)
      // el.innerHTML = '';

      new window.daum.roughmap.Lander({
        timestamp,
        key,
        mapWidth: "100%",
        mapHeight: "360",
      }).render();
    };

    renderMap();
  }, [map_array]);  

  const isImage = (file1 = "") => {
    console.log('-> file1.toLowerCase():', "ABC.jpg".toLowerCase());
    console.log('-> file1.toLowerCase().endsWith(\'jpg\'):', "ABC.jpg".toLowerCase().endsWith('jpg'));

    return ['jpg', 'jpeg', 'png', 'gif'].some(ext => file1.toLowerCase().endsWith(ext));
  }

  return (
    <div className='content'>
      <div className='title_line_left' >{cate.grp} > {cate.name}</div>
      <aside className="aside_right">
        <Link to={`/contents/create/${cate.cateno}`}>등록</Link>
        <span className='aside_menu_divide'>|</span>
        <a href='javascript: location.reload()'>새로고침</a>
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/update_text/${data.contentsno}`}>글 수정</Link>
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/update_file1/${data.contentsno}`}>파일 수정</Link>
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/youtube/${contentsno}?page=${page}&word=${word}`}>Youtube 수정</Link>     
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/map/${contentsno}?page=${page}&word=${word}`}>Map 수정</Link>                   
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/delete/${data,contentsno}?page=${page}&word=${word}`}>삭제</Link> 
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/list/${cate.cateno}?page=${page}&word=${word}`}>목록형</Link>        
        <span className='aside_menu_divide'>|</span>
        <Link to={`/contents/list_gallery/${cate.cateno}?page=${page}&word=${word}`}>갤러리형</Link>   
      </aside>
      <div className='aside_menu_line'></div>
      {/* 본문, http://localhost:9100/contents/storage/xmas02.jpg */}
      <fieldset className="fieldset_basic">
        <ul>
          <li className="li_none">
            <div style={{ width: "100%", wordBreak: "break-all" }}>
              {isImage(data.file1) && (
                <img
                  src={`http://${getIP()}:9100/contents/storage/${data.file1saved}`}
                  alt=""
                  style={{ width: "40%", float: "left", marginTop: "0.5%", marginRight: "1%" }}
                />
              )}

              <div style={{ fontSize: "1.5em", fontWeight: "bold", textAlign: 'left'}}>
                {data.title} <span style={{ fontSize: "0.8em", marginLeft: 8 }}>{data.rdate}</span>
              </div>

              <div style={{ fontSize: "0.9em", fontWeight: "bold", textAlign: 'left', backgroundColor: '#EFEFEF', margin: '20px auto'}}>
                {data.summary} 
              </div>
              
              <div style={{ whiteSpace: "pre-wrap", textAlign: 'left' }}>{data.content}</div>
            </div>
          </li>

          <li className="li_none_left">검색어(키워드): {data.word}</li>

          {/* 첨부 파일 */}
          {data.size1 > 0 && (
            <li className="li_none_left">
              <div>
                첨부 파일: 
                <a href='#' onClick={() => download('contents', `${data.file1saved}`, `${data.file1}`)}>
                  {data.file1}
                </a>{" "}
                <span>({data.size1_label})</span> 
                <a href='#' onClick={() => download('contents', `${data.file1saved}`, `${data.file1}`)}>
                  <img src="/src/assets/images/download.png" alt="download" />
                </a>
              </div>
            </li>
          )}
        </ul>
      </fieldset>

      <div style={{ margin: "20px auto 50px auto", width: "50%", marginTop: "0.5%"}}>
        {data.youtube ? (
          <div style={{ position: 'relative', paddingBottom: '80%', height: 0 }}> {/* ? 56.25% → 80%로 변경 */}
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(data.youtube)}`}
              title="YouTube player"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%', // 부모 높이에 맞게 자동 확장
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        ):(<div />)
      }
      </div>

      <div style={{ marginLeft: '27%', marginTop: "0.5%" }}>
        {map_array.length === 3 && (
          <div style={{ margin: "0.5% auto", width: '670' }}>
            <div
              id={map_array[0]}
              className="root_daum_roughmap root_daum_roughmap_landing"
            />
          </div>
        )}

      </div>


    </div>
  )
}

export default Contents_Read