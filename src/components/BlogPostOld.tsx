// import './BlogPost.css'
// import { useState, useEffect } from 'react'
// import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
// import { db } from '../../firebase/firebase-config'

// function BlogPost({ isAuth }: { isAuth: boolean }) {
//   const[postList, setPostList] = useState<any[]>([]);
//   const postCollectionRef = collection(db, "posts")

//   useEffect(() => {
//     const getPosts = async () => {
//       const data = await getDocs(postCollectionRef)
//       setPostList(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
//     }
//     getPosts();
//   }, [])
  
//   const deletePost = async (id:string) => {
//     const postDoc = doc(db, "posts", id)
//     await deleteDoc(postDoc)
//   }
  
//   return (
//     <div>
//       {postList.map((post) => {
//         return (
//           <div className="post">
//             <div className="postHeader"> 
//               <div className="title">
//                 <h1>{post.title}  </h1>
//               </div>
//               {/* post.author.id === auth.currentUser.uid && */}
//               <div className="deletePost">
//                 {isAuth && (
//                   <button onClick={() => {deletePost(post.id)}}>&#128465;</button>
//                 )}
//               </div>
//             </div>
//             <div className="postTextContainer">{post.postText}</div>
//             <h3>@{post.author.name}</h3>
//           </div>
//         );
//       })}
//     </div>
//   )
// }

// export default BlogPost