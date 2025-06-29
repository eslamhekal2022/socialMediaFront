import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const PostContext = createContext();

export const PostProvider = ({ children }) => {
  const [refresh, setRefresh] = useState(false);
  const API = import.meta.env.VITE_API_URL;
  const [userposts, setuserposts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [commentMap, setCommentMap] = useState({});
  const [toggleCommentMap, setToggleCommentMap] = useState({});
const [editingComment, setEditingComment] = useState(null);
const [updatedText, setUpdatedText] = useState("");

const token=localStorage.getItem("token")


const FetchData = async () => {
    try {
      const { data } = await axios.get(`${API}/getPosts`, {
      });
      if (data.success) {
        setPosts(data.data);
      }
    } catch (err) {
      console.error("فشل في جلب المنشورات");
    }
  };
  
  const FetchUserData = async () => {
    try {
      const { data } = await axios.get(`${API}/getUserposts`, {
        headers: { token },
      });
      if (data.success) {
        setuserposts(data.posts);
      }
    } catch (err) {
      console.error("فشل في جلب المنشورات");
    }
  };  

const handleLike = async (postId) => {
  try {

    const { data } = await axios.put(
      `${API}/likePost/${postId}`,
      {},
      {
        headers: {
          token, // ✅ نبعته كـ token
        },
      }
    );

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === postId ? { ...post, likes: data.likes } : post
      )
    );
  } catch (err) {
    toast.error("فشل في تنفيذ اللايك");
    console.error("LIKE ERROR:", err?.response?.data || err.message);
  }
};

const DoComment = async (postId) => {
  try {
    const comment = commentMap[postId];
    if (!comment?.trim()) return toast.warn("من فضلك أدخل تعليقًا");

    const { data } = await axios.post(`${API}/CommentPost/${postId}`, {
      text: comment,
    }, { headers: { token } });

    if (data.success) {
      toast.success("تم إضافة التعليق");
      setCommentMap({})
setPosts((prevPosts) =>
  prevPosts.map((post) =>
    post._id === postId
      ? { ...post, comments: data.comments } // محدثة من السيرفر
      : post
  )
);

setuserposts((prevPosts) =>
  prevPosts.map((post) =>
    post._id === postId
      ? { ...post, comments: data.comments } // محدثة من السيرفر
      : post
  )
);


    }
  } catch (err) {
    toast.error("فشل في إضافة التعليق");
  }
};

  const deleteComment = async (postId, commentId) => {
    try {
      const { data } = await axios.delete(`${API}/deleteComment/${postId}/${commentId}`, {
        headers: { token },
      });

      if (data.success) {
        toast.success("تم حذف التعليق");
        FetchData()
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, comments: data.comments } : post
          )
        );
          setuserposts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === postId ? { ...post, comments: data.comments } : post
          )
        );
      }
    } catch (err) {
      toast.error("فشل في حذف التعليق");
    }
  };

  const toggleComment = (postId) => {
    setToggleCommentMap((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleCommentChange = (postId, value) => {
    setCommentMap((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };


const updateComment = async (postId, commentId) => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.put(
      `${API}/edit-comment/${postId}/${commentId}`,
      { text: updatedText },
      { headers: { token } }
    );

    if (res.data.success) {
      toast.success("تم تعديل التعليق");
        FetchData()

      // تحديث البوستات
      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? {
                ...post,
                comments: res.data.comments,
              }
            : post
        )
      );

      setEditingComment(null);
      setUpdatedText("");
    }
  } catch (err) {
    toast.error("فشل في تعديل التعليق");
  }
};

const DeletePost = async (postId) => {
  try {
    const { data } = await axios.delete(`${API}/deletePost/${postId}`);
    if (data.success) {
      toast.success("Post deleted");

      setPosts((prev) => prev.filter((post) => post._id !== postId));
      setuserposts((prev) => prev.filter((post) => post._id !== postId));
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    toast.error("Failed to delete post");
  }
};

useEffect(() => {
FetchData()
FetchUserData()
}, [refresh]);

  return (
    <PostContext.Provider value={{userposts,DeletePost,setuserposts,FetchData,FetchUserData,handleLike,DoComment,deleteComment,toggleComment,handleCommentChange,updateComment,posts,setPosts,commentMap,setCommentMap,toggleCommentMap,setToggleCommentMap,editingComment,setEditingComment,updatedText,setUpdatedText}}>
      {children}
    </PostContext.Provider>
  );
};

export const usePost = () => useContext(PostContext);
