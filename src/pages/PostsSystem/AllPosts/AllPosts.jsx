import { useEffect } from "react";
import '../PostSystem.css';
import { useTranslation } from "react-i18next";
import { usePost } from "../../../context/postContext.jsx";
import { useUser } from "../../../context/userContext.jsx";

const AllPosts = () => {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;
  const isArabic = currentLang === "ar";
  const directionClass = isArabic ? "rtl" : "ltr";
  const userId = localStorage.getItem("userId");
  const API = import.meta.env.VITE_API_URL;

  const {
    handleLike,
    DoComment,
    deleteComment,
    toggleComment,
    handleCommentChange,
    updateComment,
    posts,
    commentMap,
    toggleCommentMap,
    editingComment,
    setEditingComment,
    updatedText,
    setUpdatedText,
    FetchUserData,
    DeletePost,
  } = usePost();

  const {
    handleToggleFollow,
    isFollowing
  } = useUser();

  useEffect(() => {
    FetchUserData();
  }, []);

  return (
    <div className="social-posts">
      {posts.filter(post => post.user).map(post => (
        <div key={post._id} className="social-post-card">
          {/* Header */}
          <div className={`social-post-header ${directionClass}`}>
            <img src={`${API}${post.user.image}`} className="avatar" alt="user" />
            <div>
              <h4 className="user-name">{post.user.name}</h4>
              {userId === post.user._id && (
                <p className="RemovePost" onClick={() => DeletePost(post._id)}>x</p>
              )}
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
            <button
              className="comment-button"
              onClick={() => toggleComment(post._id)}
            >
              {t("comment")} ({post.comments.length})
            </button>
          </div>

          {/* Comments Section */}
          {toggleCommentMap[post._id] && (
            <div className={`comments-section ${directionClass}`}>
              {/* Input */}
              <div className="comment-input-group">
                <input
                  value={commentMap[post._id] || ""}
                  onChange={(e) => handleCommentChange(post._id, e.target.value)}
                  placeholder={t("writeYourComment") || "اكتب تعليقك..."}
                />
                <button onClick={() => DoComment(post._id)}>{t("send") || "إرسال"}</button>
              </div>

              {/* Comments */}
              {post.comments.map((cmt) => (
                <div key={cmt._id} className="comment-item">
                  <img src={`${API}${cmt.user?.image}`} alt="avatar" className="comment-avatar" />

                  {/* Follow Button */}
                  {cmt.user._id !== userId && (
                    <button
                      onClick={() => handleToggleFollow(cmt.user._id)}
                      className={`follow-btn ${isArabic ? "ltr" : "rtl"}`}
                    >
                      {isFollowing(cmt.user._id) ? "- " : "+ "}
                    </button>
                  )}

                  <div className={`comment-body ${isArabic ? "ltr" : "rtl"}`}>
                    <p className="comment-author">{cmt.user?.name}</p>

                    {/* Edit Mode */}
                    {editingComment === cmt._id ? (
                      <>
                        <input
                          value={updatedText}
                          onChange={(e) => setUpdatedText(e.target.value)}
                        />
                        <button onClick={() => updateComment(post._id, cmt._id)}>💾 {t("save") || "حفظ"}</button>
                        <button onClick={() => setEditingComment(null)}>❌ {t("cancel") || "إلغاء"}</button>
                      </>
                    ) : (
                      <p className="comment-text">{cmt.text}</p>
                    )}

                    {/* Edit/Delete Buttons */}
                    {cmt.user._id === userId && (
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
                        <button onClick={() => deleteComment(post._id, cmt._id)}>
                          🗑️ {t("delete")}
                        </button>
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

export default AllPosts;
