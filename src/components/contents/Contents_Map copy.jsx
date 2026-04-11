import React, { useEffect, useState } from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import {enter_chk, axiosInstance, getIP, getYoutubeId, 
        extractKakaoMapInfo, splitKakaoMapString} from '../Tool'
import SimpleModal from '../SimpleModal';

const Contents_Youtube = () => {
  // -------------------------------------------------------------------------------
  // SimpleModal
  // -------------------------------------------------------------------------------
  // modal state
  const [modal, setModal] = useState({
    show: false,
    title: '',
    message: '',
    onConfirm: null,
  });

  const openModal = (payload) => setModal(
    { show: true, title: payload.title, message: payload.message, onConfirm: payload.onConfirm || null }
  );
  const closeModal = () => setModal((m) => ({ ...m, show: false }));
  // -------------------------------------------------------------------------------
  
  const navigate = useNavigate();

  const {contentsno} = useParams();
  console.log('-> contentsno:', contentsno);

  const [cate, setCate] = useState({});
  const [input, setInput] = useState(
    {
      contentsno:0,
      title: '',
      password: '1234',
      map: '',

    }    
  );

  const [map_array, setMap_array] = useState([]);
    
  useEffect(
    () => {
      axiosInstance.get(`/contents/read/${contentsno}`)
      .then(result => result.data)
      .then(data => {
        console.log('-> data:', data);
        
        // password는 초기값 사용
        // map: daumRoughmapContainer1762844822269/1762844822269/cz5r74kh84j
        setInput(input => ({
          ...input,
          contentsno: data.contentsno,
          title: data.title || '',
          map: data.map,
        }));

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

      // map  
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

      ensureScript().then(() => {
        // window.daum 존재 보장 후 실행
        new window.daum.roughmap.Lander({
          timestamp: map_array[1],
          key: map_array[2],
          mapWidth: "100%",
        }).render();
      });


    }, [contentsno]
  );
 
  // e.target: event가 발생한 태그
  const onChange = (e) => {
    const {id, value} = e.target;
    setInput({...input,  [id]: value});
  }

  // map 수정
  const send_update_map = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('contentsno', input.contentsno);
    formData.append('password', input.password);

    let extract_map = extractKakaoMapInfo(input.map);
    formData.append('map', extract_map);

    try {
      const response = await axiosInstance.post(`/contents/map`, formData);
      const result = Number(response.data); // axios
      console.log('서버 응답:', result);

      if (result == 0) {
        openModal({
          title: '지도 수정 실패',
          message: '지도 수정에 실패 했습니다. 다시 시도해주세요.',
        });
      } else if (result == 1) {
        openModal({
          title: '지도 수정 성공',
          message: '지도 수정에 성공 했습니다.',
          onConfirm: () => navigate(`/contents/read/${input.contentsno}`)
        });
        
      } else if (result == 2) {
        openModal({
          title: '패스워드 일치하지 않음',
          message: '패스워드 일치하지 않습니다. 다시 시도해주세요.',
        });
      } 

    } catch (err) {
      console.error(err);
      openModal({
        title: '네트워크 오류',
        message: '네트워크 오류가 발생했습니다.\n다시 시도해주세요.',
      });
    }
  }

  // youtube 삭제
  const send_delete_map = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('contentsno', input.contentsno);
    formData.append('password', input.password);
    formData.append('map', '');

    try {
      const response = await axiosInstance.post(`/contents/map`, formData);
      const result = Number(response.data); // axios
      console.log('서버 응답:', result);

      if (result == 0) {
        openModal({
          title: '지도 실패',
          message: '지도 삭제에 실패 했습니다. 다시 시도해주세요.',
        });
      } else if (result == 1) {
        setInput(input => ({
          ...input,
          youtube: '',
        }));

        openModal({
          title: '지도 삭제 성공',
          message: '지도 삭제에 성공 했습니다.',
          onConfirm: () => navigate(`/contents/read/${input.contentsno}`)
        });
        
      } else if (result == 2) {
        openModal({
          title: '패스워드 일치하지 않음',
          message: '패스워드 일치하지 않습니다. 다시 시도해주세요.',
        });

      } else if (result == 3) {
        openModal({
          title: '기본 이미지 파일 삭제 오류',
          message: '기본 이미지 파일은 삭제 할 수 없습니다.',
        });
      } 


    } catch (err) {
      console.error(err);
      openModal({
        title: '네트워크 오류',
        message: '네트워크 오류가 발생했습니다.\n다시 시도해주세요.',
      });
    }

  }

  if (map_array.length == 0) return null;

  return (
    <div className='content'>
      <div className='title_line_left' >{cate.grp} &gt; {cate.name}</div>
      <aside className='aside_right'>
        <Link to={`/contents/read/${input.contentsno}`}>조회</Link>
        <span className='aside_menu_divide'>|</span>        
        <Link to={`/contents/create/${cate.cateno}`}>등록</Link>
        <span className='aside_menu_divide'>|</span>
        <a href='#' onClick={() => location.reload()}>새로고침</a>
      </aside>
      <div className='aside_menu_line'></div> 

      <div style={{ marginLeft: '27%', marginTop: "0.5%" }}>
        <div id={map_array[0]} className="root_daum_roughmap root_daum_roughmap_landing"></div>

      </div>

      <div style={{margin: '10px auto', width: '670px', textAlign: 'left'}}>
        <div style={{ fontSize: "1.5em", fontWeight: "bold", marginBottom: '30px' }}>{input.title}</div>
        
        <textarea name="map" id='map' autoFocus 
          value={input.map}
          onChange={onChange} required 
          className="form-control"
          rows={8} style={{ flex: 1 }}
        />

        <label>패스워드</label>
        <input
          type="password" name="password" id='password'
          value={input.password} 
          onChange={onChange} required
          onKeyDown={e=>enter_chk(e,'btn_send')}
          className="form-control" style={{ flex: 1 }}
        />
      </div>            
      
      <div style={{ whiteSpace: "pre-wrap", textAlign: 'center' }}>
        <button type="submit" id='btn_send' 
                className="btn btn-outline-secondary btn-sm"
                onClick={(e) => send_update_map(e)} style={{marginRight: '5px'}}>
          지도 변경 처리
        </button>
        <button type="submit" id='btn_send' 
                className="btn btn-outline-secondary btn-sm" 
                onClick={(e) => send_delete_map(e)} style={{marginRight: '5px'}}>
          지도 변경 삭제
        </button>
        <button
          type="button"
          onClick={() => navigate(`/contents/read/${input.contentsno}`)}
          className="btn btn-outline-secondary btn-sm"
        >
          취소
        </button>
      </div>

      <div>[참고]  지도 가져오는 방법</div> 
      <div style={{margin: '20px auto 50px auto'}}>

      </div>


      {/* 모달 */}
      <SimpleModal
        show={modal.show}
        title={modal.title}
        message={modal.message}
        onClose={modal.onConfirm || closeModal}
        onConfirm={modal.onConfirm || closeModal}
      />   
    </div>

  )
}

export default Contents_Youtube
