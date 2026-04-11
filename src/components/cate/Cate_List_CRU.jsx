// 카테고리 등록, 목록, 조회, 수정
// /src/components/employee/Signup.jsx
import React, {useState, useEffect} from 'react'
import {enter_chk, getIP, axiosInstance, getNowDate} from '../Tool'
import {Link, useNavigate} from 'react-router-dom'
import update_img from '../../assets/images/update2.png';
import delete_img from '../../assets/images/delete2.png';

const Cate_List = () => {
  const navigate = useNavigate();

  const [send_label, setSend_label] = useState('등록');

  // 상태 객체 사용
  const [input, setInput] = useState(
    {
      cateno: '',
      grp: '',
      name: '',
      cnt: 0,
      seqno: 1,
      visible: '',
      rdate: '',
    }    
  );

    // e.target: event가 발생한 태그
  const onChange = (e) => {
    // 구조분해할당
    const{id, value} = e.target;
    console.log(`-> ${id}: ${value}`);
    setInput({
      ...input,  // input 객체의 값 할당
      [e.target.id]: e.target.value, // 해당하는 변수의 값을 덮어씀    
    });
  }

  const send = (e) => {
    e.preventDefault(); // ★

    if (send_label === '등록') {
      axiosInstance.post(`/cate/save`, {
        grp: input.grp,
        name: input.name,
        cnt: input.cnt,
        seqno: input.seqno,
        visible: input.visible,
        rdate: getNowDate(),         
      })
      .then(result => result.data)
      .then(data => {
        console.log('-> data:', data);
        loadData();
      })
      .catch(err => console.error(err))
    } else if (send_label === '수정') { // 수정
      axiosInstance.post(`/cate/save`, {
        grp: input.grp,
        name: input.name,
        cnt: input.cnt,
        seqno: input.seqno,
        visible: input.visible,
        rdate: getNowDate(),         
      })
      .then(result => result.data)
      .then(data => {
        console.log('-> data:', data);
        loadData();
      })
      .catch(err => console.error(err))
    }


  }

  const loadData = () => {
    axiosInstance.get(`/cate/find_all`)
    .then(result => result.data)
    .then(data => {
      console.log('-> data:', data);
      setData(data);
      console.log('-> setData(data)');
    })
    .catch(err => console.error(err));
    
  }

  const [data, setData] = useState([]);
  useEffect( // 현재 목록 페이지에서 다시 렌더링이 발생이 안됨.
    () => {
      loadData();
    }, []); // 최초 1회만 실행  

  const read_for_update = (cateno) => {
    console.log('-> cateno:', cateno);

    axiosInstance.get(`/cate/${cateno}`)
    .then(result => result.data)
    .then(data => {
      setInput({
        cateno: data.cateno,
        grp: data.grp,
        name: data.name,
        cnt: data.cnt,
        seqno: data.seqno,
        visible: data.visible,
        rdate: data.rdate,   
      });

      setSend_label('수정');
    })
    .catch(err => console.error(err));
  }

  const cancel = () => {
    setSend_label('등록');
    setInput({
      cateno: '',
      grp: '',
      name: '',
      cnt: 0,
      seqno: 1,
      visible: '',
      rdate: '', 
    });

  }

  return (
    <div>
      <div className='title_line'>카테고리</div>
      <div className='menu_line'>새로고침</div>
      <div>
        <form id='frm' onSubmit={send} style={{margin:'10px auto', width:'80%', textAlign:'left'}}>
          <div className='div_row'>
            <input type="text" className="form-control form-control-sm" id="grp" 
                   placeholder="그룹 이름" onKeyDown={e=>enter_chk(e,'name')} 
                   onChange={onChange} value={input.grp} style={{width: '20%'}} autoFocus />          
            <input type="text" className="form-control form-control-sm" id="name" 
                   placeholder="카테고리 이름" onKeyDown={e=>enter_chk(e,'cnt')} 
                   onChange={onChange} value={input.name} style={{width: '20%'}} />          
            <input type="number" min="0" step="1"
                   className="form-control form-control-sm" id="cnt" 
                   placeholder="관련 자료수" title='관련 자료수' onKeyDown={e=>enter_chk(e,'seqno')} 
                   onChange={onChange} value={input.cnt} style={{width: '10%'}} /> 
            <input type="number" min="0" step="1"
                   className="form-control form-control-sm" id="seqno" 
                   placeholder="출력 순서" title='출력 순서' onKeyDown={e=>enter_chk(e,'visible')} 
                   onChange={onChange} value={input.seqno} style={{width: '10%'}} />
            <select id='visible' className="form-control form-control-sm" 
                    onChange={onChange} value={input.visible}
                    title='출력 모드' onKeyDown={e=>enter_chk(e,'btnSend')} 
                    style={{width: '10%'}}>
              <option value=''>선택</option>
              <option value='Y'>Y</option>
              <option value='N'>N</option>
            </select>
            <button id='btnSend' type="submit" className="btn btn-outline-info btn-sm" 
                    style={{marginRight:'0px'}}>{send_label}</button>
            <button id='btnReset' type="reset" className="btn btn-outline-info btn-sm" 
                    style={{marginRight:'0px'}} onClick={cancel}>취소</button>

          </div>

        </form>

        <table className='table_center table table-hover'>
          <tbody>
            {
              data.length == 0 ? (
                <tr><td>등록된 카테고리가 없습니다.</td></tr>
              ): (
                data && data.map((item, index) => 
                  <tr key={index}>
                    <td className='table_underline' style={{textAlign: 'center'}}>{index+1}</td>  
                    <td className='table_underline' style={{textAlign: 'center'}}>
                      {item.grp}
                    </td>  
                    <td className='table_underline' style={{textAlign: 'center'}}>
                      {item.cnt}
                    </td>      
                    <td className='table_underline' style={{textAlign: 'center'}}>
                      {item.seqno}
                    </td>                                      
                    <td className='table_underline' style={{textAlign: 'center'}}>
                      {/* <Link to={`/employee/read/${item.employeeno}`}> */}
                        {item.name}
                      {/* </Link>                     */}
                    </td>  
                    <td className='table_underline' style={{textAlign: 'center'}}>{item.rdate?.substring(0, 10)}</td>  
                    <td className='table_underline' style={{textAlign: 'center'}}>
                      {item.seqno}/{item.visible}
                      <a href='#' onClick={() => read_for_update(item.cateno)}><img src={update_img} className='icon' /></a>
                      <img src={delete_img} className='icon' />
                    </td>
                  </tr>
                )
              )
            }
          </tbody>
        </table>

      </div>
    </div>
  )
}

export default Cate_List
