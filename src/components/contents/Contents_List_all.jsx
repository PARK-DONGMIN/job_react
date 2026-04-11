import React, { useEffect, useState } from 'react'
import {useParams, useNavigate, Link} from 'react-router-dom'
import { axiosInstance, getIP } from '../Tool';

const Contents_List_all = () => {
  const navigate = useNavigate();

  const {cateno} = useParams();
  console.log('-> cateno:', cateno);

  const [cate, setCate] = useState({});
  const [data, setData] = useState([]);
  
  useEffect(
    () => {
      axiosInstance.get(`/cate/${cateno}`)
      .then(result => result.data)
      .then(data => {
        setCate(data);
        console.log('-> cate data:', data);
      })
      .catch(err => console.error(err));

      axiosInstance.get(`/contents/list_all/${cateno}`)
      .then(result => result.data)
      .then(data => {
        setData(data);
        console.log('-> data:', data);
      })
      .catch(err => console.error(err));
    }, [cateno]
  );

  return (
    <div className='content'>
      <div className='title_line_left' >{cate.grp} &gt; {cate.name}</div>
      <aside className="aside_right">
        <Link to={`/contents/create/${cate.cateno}`}>등록</Link>
        <span className='aside_menu_divide'>|</span>
        <a href='javascript: location.reload()'>새로고침</a>
      </aside>
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
          {data.map((item) => (
            <tr
              key={item.contentsno}
              onClick={() => navigate(`/contents/read/${item.contentsno}`)}
              style={{ cursor: 'pointer' }}
            >
              <td className='td_basic'>
                <img src={`http://${getIP()}:9100/contents/storage/${item.file1}`} 
                     style={{width: '200px', height: '150px'}} />
              </td>
              <td className='td_left'>
                <span style={{ fontWeight: 'bold' }}>{item.title} {item.rdate.substring(0, 10)}</span><br />
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
