import '../styles/CreatePost.css';
import BlogCoverPreview from '../components/BlogCoverPreview';
import Loading from '../components/Loading';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { doc, updateDoc } from 'firebase/firestore';
import { db, storage } from '../firebase/firebase-config';

import ReactQuill, { Quill } from 'react-quill';
import { ImageResize } from "quill-image-resize-module-ts";
import 'react-quill/dist/quill.snow.css';
import parse from 'html-react-parser';

Quill.register("modules/imageResize", ImageResize);

function EditPost({ getCurrentPost, editPostAlignment }: {
	getCurrentPost: (id: string) => {
		blogId: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogCoverPhotoName: string;
		blogTitle: string;
	};
	editPostAlignment: (currentPost: {
		blogID: string;
		blogHTML: string;
		blogCoverPhoto?: string;
		blogCoverPhotoName?: string;
		blogTitle: string;
	}) => void;
}) {
	const [isLoading, setisLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>('');
	const [modalActive, setModalActive] = useState<boolean>(false);
	const [coverFileChanged, setCoverFileChanged] = useState<boolean>(false);
	const [isPreview, setIsPreview] = useState<boolean>(false);
	const [blogPost, setBlogPost] = useState<{
		blogId: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogCoverPhotoName: string;
		blogTitle: string;
	}>({
		blogId: "",
		blogHTML: "",
		blogCoverPhoto: "",
		blogCoverPhotoName: "",
		blogTitle: ""
	});

	useEffect(() => {
		document.title = "Edit Post | DeadMarket";

		//only set data if id does not match route blogid or it is blank
		if ((routeid && blogPost.blogId !== routeid) || (routeid && blogPost.blogId === "")) {
			const currentPost = getCurrentPost(routeid);
			setBlogPost(currentPost);
		}

		return () => {
			document.title = "DeadMarket";
		};
	}, []);

	const { routeid } = useParams();
	const quillRef = useRef<ReactQuill>(null);
	const navigate = useNavigate();
	const blogContentFolderID = uuidv4();

	const toggleModal = (value: boolean) => {
		setModalActive(value);
	}

	const editCurrentPost = (
		currentPost: {
			blogId: string;
			blogHTML: string;
			blogCoverPhoto: string;
			blogCoverPhotoName: string;
			blogTitle: string;
		}) => {
		setBlogPost(currentPost);
	}

	const coverHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const coverFile = e.target.files[0];

			editCurrentPost({
				...blogPost,
				blogCoverPhoto: URL.createObjectURL(coverFile),
				blogCoverPhotoName: coverFile.name
			});
			setCoverFileChanged(true);
		}
	}

	const inputHander = (targetValue: string) => {
		editCurrentPost({
			...blogPost,
			blogHTML: targetValue
		});
	}

	const imageHandler = async () => {
		const input = document.createElement('input');

		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();

		input.onchange = async () => {
			if (!input.files || !input?.files?.length || !input?.files?.[0]) {
				return;
			}
			if (!quillRef.current) {
				return;
			}

			try {
				const editor = quillRef.current.getEditor();
				const contentFile = input.files[0];
				const uniqueId = uuidv4();
				const storageRef = ref(storage, `blogContentPhotos/${blogContentFolderID}/${uniqueId}-${contentFile.name}`);

				await uploadBytes(storageRef, contentFile);
				console.log('Uploaded a blob or file!');

				const downloadURL = await getDownloadURL(storageRef);

				const range = editor.getSelection(true);
				editor.insertEmbed(range.index, "image", downloadURL);

				const cursor = { index: range.index + 1, length: 0 };
				editor.setSelection(cursor);

			} catch (error: any) {
				console.log("upload err:", error);
			}
		}
	}

	const uploadHandler = async () => {
		console.log("Handling Upload!");

		if (blogPost.blogTitle.length === 0 ||
			blogPost.blogHTML === "<p><br></p>" ||
			blogPost.blogHTML.trim().length === 0) {
			setErrorMsg("Please ensure Blog Title & Blog Post has been filled!");
			setError(true);

			setTimeout(() => {
				setError(false);
			}, 3000);
			return;
		}

		if (blogPost.blogTitle.trim().length === 0 ||
			blogPost.blogHTML.replace(/\s/g, '') === "<p></p>") {
			setErrorMsg("Please ensure Blog Title & Blog Post is not comprised of whitespaces");
			setError(true);

			setTimeout(() => {
				setError(false);
			}, 3000);
			return;
		}

		if (blogPost.blogCoverPhoto.trim().length === 0) {
			setErrorMsg("Please ensure you uploaded a Cover Photo");
			setError(true);

			setTimeout(() => {
				setError(false);
			}, 3000);
			return;
		}

		if (!routeid) {
			console.log("invalid Id");
			return;
		}

		try {
			setisLoading(true);
			const docRef = doc(db, "blogPosts", routeid);

			if (coverFileChanged) {
				const uniqueId = uuidv4();
				const response = await fetch(blogPost.blogCoverPhoto);
				const blob = await response.blob();
				const storageRef = ref(storage, `blogCoverPhotos/${uniqueId}-${blogPost.blogCoverPhotoName}`);

				await uploadBytes(storageRef, blob);
				console.log('Uploaded a blob or file!');

				const downloadURL = await getDownloadURL(storageRef);
				await updateDoc(docRef, {
					blogTitle: blogPost.blogTitle,
					blogHTML: blogPost.blogHTML,
					blogCoverPhoto: downloadURL,
					blogCoverPhotoName: storageRef.name,
				});

				//aligns front end with backend without rerender
				editPostAlignment({
					blogID: routeid,
					blogHTML: blogPost.blogHTML,
					blogCoverPhoto: downloadURL,
					blogCoverPhotoName: storageRef.name,
					blogTitle: blogPost.blogTitle,
				});
			} else {
				await updateDoc(docRef, {
					blogTitle: blogPost.blogTitle,
					blogHTML: blogPost.blogHTML
				});

				//aligns front end with backend without rerender
				editPostAlignment({
					blogID: routeid,
					blogHTML: blogPost.blogHTML,
					blogTitle: blogPost.blogTitle,
				});
			}

			setisLoading(false);
			editCurrentPost({
				blogId: "",
				blogHTML: "",
				blogCoverPhoto: "",
				blogCoverPhotoName: "",
				blogTitle: "",
			});

			navigate(`/view-blog/${docRef.id}`);

		} catch (error: any) {
			setErrorMsg(error);
			setisLoading(false);
			setError(true);
		}
	}

	const modules = useMemo(() => ({
		toolbar: {
			container: [
				[{ size: ["small", "large"] }],
				["bold", "italic", "underline"],
				[{ align: [] }],
				[{ size: null }, { list: "ordered" }, { list: "bullet" }, "link"],
				["image"]
			],
			handlers: {
				image: imageHandler
			}
		},
		imageResize: {
			// parchment: Quill.import("parchment"),
			parchment: {
				// ...p,
				image: {
					attributes: ["width", "height"]
				}
			},
			modules: ["Resize", "DisplaySize"]
		}
	}), []);

	const formats = [
		"header",
		"bold",
		"italic",
		"underline",
		"align",
		"strike",
		"blockquote",
		"list",
		"bullet",
		"indent",
		"link",
		"image",
		"video"
	];

	return (
		<div className="create-post">
			{modalActive && <BlogCoverPreview blogPhotoFileURL={blogPost.blogCoverPhoto} toggleModal={toggleModal} />}
			{isLoading && <Loading />}
			<div className="container">
				<div className="blog-actions">
					<button onClick={uploadHandler}>Publish Post</button>
					{!isPreview && <button onClick={() => setIsPreview(true)}>Preview Post</button>}
					{isPreview && <button onClick={() => setIsPreview(false)}>Edit Post</button>}
				</div>
				<div className={!error ? "err-message invisible" : "err-message"}>
					<p><span>Error: </span>{errorMsg}</p>
				</div>

				{isPreview ?
					<div>
						<div className="preview-container quillWrapper">
							<h2>{blogPost.blogTitle}</h2>
							<img src={blogPost.blogCoverPhoto} alt="Blog Cover Photo" />
							<div className="post-content ql-editor">
								{parse(blogPost.blogHTML)}
							</div>
						</div>
					</div>
					:
					<>
						<div className="blog-info">
							<input type="text" value={blogPost.blogTitle} placeholder="Enter Blog Title"
								onChange={e =>
									editCurrentPost({
										...blogPost,
										blogTitle: e.target.value
									})
								}
							/>
							<div className="upload-file">
								<label htmlFor="blog-photo">Upload Cover Photo</label>
								<input type="file" id="blog-photo" onChange={coverHandler} accept=".jpg, .jpeg, .png, .webp, .gif" />
								<button 
									onClick={() => setModalActive(true)} 
									className={blogPost.blogCoverPhoto === "" ? "preview button-inactive" : "preview"}>
									Preview Photo
								</button>
								<span>File Chosen: {blogPost.blogCoverPhotoName}</span>
							</div>
						</div>
						<div className="editor">
							<ReactQuill
								ref={quillRef}
								theme="snow"
								value={blogPost.blogHTML}
								onChange={value => inputHander(value)}
								modules={modules}
								formats={formats}
								placeholder='Write Your Blog Here'
							/>
						</div>
					</>
				}
			</div>
		</div>
	)
}

export default EditPost;