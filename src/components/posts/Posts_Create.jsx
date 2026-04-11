import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from '../../api/axios';
import { useUserStore } from "../../store/store.js";

const Posts_Create = () => {
  const navigate = useNavigate();
  const { cateno } = useParams();

  // 로그인 사용자 정보
  const { userid } = useUserStore(); // ⭐ pdmno → userId

  const [cate, setCate] = useState({});

  useEffect(() => {
    axiosInstance
      .get(`/cate/${cateno}`)
      .then((res) => setCate(res.data))
      .catch(console.error);
  }, [cateno]);

  const [input, setInput] = useState({
    title: "",
    content: "",
    word: "",
    password: "",
  });

  const onChange = (e) => {
    const { id, value } = e.target;
    setInput({ ...input, [id]: value });
  };

  const [file, setFile] = useState(null);

  // 등록
  const send = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // console.log("프론트에서 백으로 보내는 userId:", userid); // ✨ 요거 지웠다고 했으니까, 그대로 둬도 돼!
    formData.append("userId", userid); // ⭐ 핵심
    formData.append("cateno", cateno);
    formData.append("title", input.title);
    formData.append("content", input.content);
    formData.append("word", input.word);
    formData.append("password", input.password);
    if (file) formData.append("file1MF", file);

    try {
      const res = await axiosInstance.post("/posts/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.status === 200) {
        // ⭐ 이 부분을 이렇게 바꿔주면 돼!
        navigate("/posts/list/" + cateno);
      } else {
        alert("글 등록 실패");
      }
    } catch (err) {
      alert("네트워크 오류");
      console.error(err);
    }
  };

  return (
    <div className="content">
      <div className="title_line_left">
        {cate.grp} &gt; {cate.name}
      </div>

      <aside className="aside_right">
        <Link to={`/community/${cateno}`}>목록</Link>
        <span className="aside_menu_divide">|</span>
        <a href="#" onClick={() => location.reload()}>새로고침</a>
      </aside>

      <div className="aside_menu_line"></div>

      <form onSubmit={send} encType="multipart/form-data">
        {/* 제목 */}
        <div className="input_div">
          <label>제목</label>
          <input
            type="text"
            id="title"
            value={input.title}
            onChange={onChange}
            required
            autoFocus
            className="form-control"
          />
        </div>

        {/* 내용 */}
        <div className="input_div">
          <label>내용</label>
          <textarea
            id="content"
            value={input.content}
            onChange={onChange}
            required
            rows={6}
            className="form-control"
          />
        </div>

        {/* 검색어 */}
        <div className="input_div">
          <label>검색어</label>
          <input
            type="text"
            id="word"
            value={input.word}
            onChange={onChange}
            className="form-control"
          />
        </div>

        {/* 파일 */}
        <div className="input_div">
          <label>파일</label>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="form-control"
          />
        </div>

        {/* 비밀번호 */}
        <div className="input_div">
          <label>비밀번호</label>
          <input
            type="password"
            id="password"
            value={input.password}
            onChange={onChange}
            required
            className="form-control"
          />
        </div>

        <div style={{ textAlign: "center", marginTop: 10 }}>
          <button type="submit" className="btn btn-outline-secondary btn-sm">
            등록
          </button>
          <button
            type="button"
            onClick={() => navigate(`/community/${cateno}`)}
            className="btn btn-outline-secondary btn-sm"
            style={{ marginLeft: 8 }}
          >
            목록
          </button>
        </div>
      </form>
    </div>
  );
};

export default Posts_Create;