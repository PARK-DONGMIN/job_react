import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link, useSearchParams } from 'react-router-dom';
import axiosInstance from '../../api/axios';

const getIP = () => "localhost"; // 필요한 경우 실제 IP로 변경

const Posts_Read = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get('page') ?? 0);
  const word = searchParams.get('word') ?? '';

  const navigate = useNavigate();
  const { postId } = useParams();   // 🔥 변경

  const [cate, setCate] = useState({});
  const [data, setData] = useState({});
  const [map_array, setMap_array] = useState([]);

  /* =========================
     게시글 조회
  ========================= */
  useEffect(() => {
    axiosInstance.get(`/posts/read/${postId}`)
      .then(res => res.data)
      .then(data => {
        setData(data);

        if (data.map) {
          setMap_array(splitKakaoMapString(data.map));
        }

        // 카테고리 조회
        axiosInstance.get(`/cate/${data.cateno}`)
          .then(res => setCate(res.data))
          .catch(err => console.error(err));
      })
      .catch(err => console.error(err));
  }, [postId]);

  /* =========================
     카카오 지도 렌더링
  ========================= */
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
      const el = document.getElementById(containerId);
      if (!el) return;

      new window.daum.roughmap.Lander({
        timestamp,
        key,
        mapWidth: "100%",
        mapHeight: "360",
      }).render();
    };

    renderMap();
  }, [map_array]);

  /* =========================
     이미지 파일 여부
  ========================= */
  const isImage = (file1 = "") =>
    ['jpg', 'jpeg', 'png', 'gif'].some(ext =>
      file1.toLowerCase().endsWith(ext)
    );

  return (
    <div className='content'>
      <div className='title_line_left'>
        {cate.grp} &gt; {cate.name}
      </div>

      {/* =========================
          우측 메뉴
      ========================= */}
      <aside className="aside_right">
        <Link to={`/posts/create/${cate.cateno}`}>등록</Link>
        <span className='aside_menu_divide'>|</span>

        <a href="#" onClick={() => location.reload()}>새로고침</a>
        <span className='aside_menu_divide'>|</span>

        <Link to={`/posts/update_text/${data.postId}`}>글 수정</Link>
        <span className='aside_menu_divide'>|</span>

        <Link to={`/posts/update_file1/${data.postId}`}>파일 수정</Link>
        <span className='aside_menu_divide'>|</span>

        <Link to={`/posts/youtube/${postId}?page=${page}&word=${word}`}>Youtube 수정</Link>
        <span className='aside_menu_divide'>|</span>

        <Link to={`/posts/map/${postId}?page=${page}&word=${word}`}>Map 수정</Link>
        <span className='aside_menu_divide'>|</span>

        <Link to={`/posts/delete/${data.postId}?page=${page}&word=${word}`}>삭제</Link>
        <span className='aside_menu_divide'>|</span>

        <Link to={`/posts/list/${cate.cateno}?page=${page}&word=${word}`}>목록형</Link>
        <span className='aside_menu_divide'>|</span>

        <Link to={`/posts/list_gallery/${cate.cateno}?page=${page}&word=${word}`}>갤러리형</Link>

        {/* 신고 */}
        <span className='aside_menu_divide'>|</span>
        <button
          onClick={() => navigate(`/report/create/${data.postId}`)}
          style={{
            backgroundColor: "#ff4d4f",
            color: "white",
            padding: "5px 10px",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          신고
        </button>
      </aside>

      <div className='aside_menu_line'></div>

      {/* =========================
          본문
      ========================= */}
      <fieldset className="fieldset_basic">
        <ul>
          <li className="li_none">
            <div style={{ width: "100%", wordBreak: "break-all" }}>

              {isImage(data.file1) && (
                <img
                  src={`http://${getIP()}:9100/posts/storage/${data.file1saved}`}
                  alt=""
                  style={{
                    width: "40%",
                    float: "left",
                    marginTop: "0.5%",
                    marginRight: "1%"
                  }}
                />
              )}

              <div style={{ fontSize: "1.5em", fontWeight: "bold", textAlign: 'left' }}>
                {data.title}
                <span style={{ fontSize: "0.8em", marginLeft: 8 }}>
                  {data.rdate}
                </span>
              </div>

              <br />
              <div style={{ whiteSpace: "pre-wrap", textAlign: 'left' }}>
                {data.content}
              </div>
            </div>
          </li>

          <li className="li_none_left">
            검색어(키워드): {data.word}
          </li>

          {data.size1 > 0 && (
            <li className="li_none_left">
              첨부 파일:&nbsp;
              <a href='#'
                 onClick={() =>
                   download('posts', data.file1saved, data.file1)
                 }>
                {data.file1}
              </a>
              &nbsp;<span>({data.size1_label})</span>
              &nbsp;
              <a href='#'
                 onClick={() =>
                   download('posts', data.file1saved, data.file1)
                 }>
                <img src="/src/assets/images/download.png" alt="download" />
              </a>
            </li>
          )}
        </ul>
      </fieldset>

      {/* =========================
          YouTube
      ========================= */}
      {data.youtube && (
        <div style={{ margin: "20px auto", width: "50%" }}>
          <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
            <iframe
              src={`https://www.youtube.com/embed/${getYoutubeId(data.youtube)}`}
              title="YouTube player"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* =========================
          지도
      ========================= */}
      {map_array.length === 3 && (
        <div style={{ margin: "20px auto", width: "670px" }}>
          <div
            id={map_array[0]}
            className="root_daum_roughmap root_daum_roughmap_landing"
          />
        </div>
      )}
    </div>
  );
};

export default Posts_Read;
