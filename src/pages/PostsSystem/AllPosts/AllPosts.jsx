import {  useEffect } from "react";
import '../PostSystem.css';
import { useTranslation } from "react-i18next";
import { usePost } from "../../../context/postContext.jsx";
import { useUser } from "../../../context/userContext.jsx";

const GetUserPosts = () => {
  const {t,i18n}=useTranslation()
const currentLang = i18n.language; // هتكون "ar" أو "en"

  const {handleLike,
    DoComment,
    deleteComment,
    toggleComment,
    handleCommentChange,
    updateComment,posts,
    commentMap,
    toggleCommentMap,
    editingComment,
    setEditingComment,
    updatedText,
    setUpdatedText,
FetchUserData,
DeletePost
  }=usePost()
  const API = import.meta.env.VITE_API_URL;

  let userId = localStorage.getItem("userId");

  

  const {
handleToggleFollow,isFollowing
  }=useUser()

  useEffect(() => {
    FetchUserData();
  }, []);

  




  return (
    <div className="social-posts">
      {posts.filter((x)=>x.user).map((post) => (
        <div key={post._id} className="social-post-card">
          {/* Header */}
          <div className="social-post-header">
            <img src={`${API}${post.user?.image}`} className="avatar" alt="user" />
            <div>
              <h4 className="user-name">{post.user?.name}</h4>
              <p className="RemovePost" onClick={() => DeletePost(post._id)}>x</p>
              <span className="post-date">{new Date(post.createdAt).toLocaleString()}</span>
            </div>
          
          </div>

          {/* Content */}
          <p className="post-text">{post.content}</p>

          {/* Images */}
          {post.image?.length > 0 && (
            <div className="post-images">
              {post.image.map((img, i) => (
                <img key={i} src={`${API}${img}`} alt={`post-${i}`} />
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="post-actions">
            <button
              className={post.likes.includes(userId) ? "like-button active" : "like-button"}
              onClick={() => handleLike(post._id)}
            >
              {t("Like")} ({post.likes.length})
            </button>
            <button className="comment-button" onClick={() => toggleComment(post._id)}>
              {t("comment")} ({post.comments.length})
            </button>
          </div>

          {/* Comments Section */}
          {toggleCommentMap[post._id] && (
            <div className={currentLang=="ar"?"comments-section rtl":"comments-section ltr"}>
              <div className="comment-input-group">
                <input
                  value={commentMap[post._id] || ""}
                  onChange={(e) => handleCommentChange(post._id, e.target.value)}
                  placeholder="اكتب تعليقك..."
                />
                <button onClick={() => DoComment(post._id)}>إرسال</button>
              </div>

              {/* Comments */}
              {post.comments.map((cmt) => (
                <div key={cmt._id} className="comment-item">

                  <img src={`${API}${cmt.user?.image}`} alt="avatar" className="comment-avatar" />
                  {cmt.user._id==userId?null: <button  onClick={() => handleToggleFollow(cmt.user._id)} 
                    className={`follow-btn ${currentLang === "ar" ? "follow-btn ltr" : "follow-btn rtl"}`
                    }
>
    {isFollowing(cmt.user._id) ? "- ":"+"}
              </button>}
                  <div className={currentLang=="ar"?"comment-body ltr":"comment-body rtl"}>
                    <p className="comment-author">{cmt.user?.name}</p>

                    {editingComment === cmt._id ? (
                      <>
                        <input
                          value={updatedText}
                          onChange={(e) => setUpdatedText(e.target.value)}
                        />
                        <button onClick={() => updateComment(post._id, cmt._id)}>💾 حفظ</button>
                        <button onClick={() => setEditingComment(null)}>❌ إلغاء</button>
                      </>
                    ) : (
                      <p className="comment-text">{cmt.text}</p>
                    )}

                    {cmt.user._id == userId && (
                      <div className="comment-actions">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditingComment(cmt._id);
                            setUpdatedText(cmt.text);
                          }}
                        >
                        ✏️ {t("edit")}

                        </button>
                        <button  onClick={() => deleteComment(post._id, cmt._id)}>🗑️  {t("delete")}</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>

  );
};

export default GetUserPosts;
