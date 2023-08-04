import '../styles/CreatePost.css'
import BlogCoverPreview from '../components/BlogCoverPreview';
import Loading from '../components/Loading';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, doc, setDoc } from 'firebase/firestore'
import { db, storage } from '../firebase/firebase-config'

import ReactQuill, { Quill } from 'react-quill';
import { ImageResize } from "quill-image-resize-module-ts";
import 'react-quill/dist/quill.snow.css';
Quill.register("modules/imageResize", ImageResize)

function CreatePost({ profileId, blogPost, editCurrentPost, createPostAlignment }: {
	profileId: string,
	blogPost: {
		id: string,
		title: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogCoverPhotoName: string;
		welcomeScreen: boolean;
	},
	editCurrentPost: (currentPost: {
		id: string;
		title: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogCoverPhotoName: string;
		welcomeScreen: boolean;
	}) => void,
	createPostAlignment: (currentPost: {
		blogID: string;
		blogHTML: string;
		blogCoverPhoto: string;
		blogCoverPhotoName: string;
		blogTitle: string;
		blogDate: number;
	}) => void
}) {
	const quillRef = useRef<ReactQuill>(null);
	const navigate = useNavigate();
	const blogContentFolderID = uuidv4();

	const [isLoading, setisLoading] = useState<boolean>(false);
	const [error, setError] = useState<boolean>(false);
	const [errorMsg, setErrorMsg] = useState<string>('');
	const [modalActive, setModalActive] = useState<boolean>(false);

	useEffect(() => {
		document.title = "Create Post | DeadMarket"

		return () => {
			document.title = "DeadMarket"
		};
	}, []);

	const coverHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const coverFile = e.target.files[0]
			console.log("Cover File:", coverFile)

			editCurrentPost({
				...blogPost,
				blogCoverPhoto: URL.createObjectURL(coverFile),
				blogCoverPhotoName: coverFile.name
			})
			// setBlogPost(prevState => ({
			// 	...prevState,
			// 	blogCoverPhoto: URL.createObjectURL(coverFile),
			// 	blogCoverPhotoName: coverFile.name
			// }))
			
		}
	}

	const inputHander = (targetValue: string) => {
		console.log(blogPost)

		editCurrentPost({
			...blogPost,
			blogHTML: targetValue
		})
		// setBlogPost(prevState => ({
		// 	...prevState,
		// 	blogHTML: targetValue
		// }))
	}

	const imageHandler = async () => {
		const input = document.createElement('input');

		input.setAttribute('type', 'file');
		input.setAttribute('accept', 'image/*');
		input.click();

		input.onchange = async () => {
			if (!input.files || !input?.files?.length || !input?.files?.[0]) {
				return
			}
			if (!quillRef.current) {
				return
			}

			try {
				const editor = quillRef.current.getEditor();
				const contentFile = input.files[0];
				console.log("Content File:", contentFile)
				const uniqueId = uuidv4()

				const storageRef = ref(storage, `blogContentPhotos/${blogContentFolderID}/${uniqueId}-${contentFile.name}`);

				await uploadBytes(storageRef, contentFile)
					.then(() => {
						console.log('Uploaded a blob or file!');
					})
					.catch((err) => {
						console.log(err);
					});

				const downloadURL = await getDownloadURL(storageRef)

				const range = editor.getSelection(true);
				editor.insertEmbed(range.index, "image", downloadURL);

				const cursor = { index: range.index + 1, length: 0 }
				editor.setSelection(cursor);

			} catch (err) {
				console.log("upload err:", err);
			}
		};

	}

	const uploadHandler = async () => {
		console.log("Handling Upload")

		if (blogPost.title.length === 0 ||
			blogPost.blogHTML === "<p><br></p>" ||
			blogPost.blogHTML.trim().length === 0) {
			setError(true)
			setErrorMsg("Please ensure Blog Title & Blog Post has been filled!")
			setTimeout(() => {
				setError(false)
			}, 3000)
			return
		}

		if (blogPost.title.trim().length === 0 ||
			blogPost.blogHTML.replace(/\s/g, '') === "<p></p>") {
			setError(true)
			setErrorMsg("Please ensure Blog Title & Blog Post is not comprised of whitespaces")
			setTimeout(() => {
				setError(false)
			}, 3000)
			return
		}

		if (blogPost.blogCoverPhoto.trim().length === 0) {
			setError(true)
			setErrorMsg("Please ensure you uploaded a Cover Photo")
			setTimeout(() => {
				setError(false)
			}, 3000)
			return
		}

		setisLoading(true);

		const uniqueId = uuidv4()
		const blob = await fetch(blogPost.blogCoverPhoto).then(r => r.blob());
		const storageRef = ref(storage, `blogCoverPhotos/${uniqueId}-${blogPost.blogCoverPhotoName}`);

		await uploadBytes(storageRef, blob).then(() => {
			console.log('Uploaded a blob or file!');
		}, (err) => {
			console.log(err);
			setisLoading(false);
		});

		const downloadURL = await getDownloadURL(storageRef)
		const timestamp = await Date.now();
		const docRef = doc(collection(db, "blogPosts"))

		await setDoc(docRef, {
			blogID: docRef.id,
			blogTitle: blogPost.title,
			blogHTML: blogPost.blogHTML,
			blogCoverPhoto: downloadURL,
			blogCoverPhotoName: storageRef.name,
			profileId: profileId,
			unixTimestamp: timestamp
		})

		//aligns front end with backend without rerender
		createPostAlignment({
			blogID: docRef.id,
			blogHTML: blogPost.blogHTML,
			blogCoverPhoto: downloadURL,
			blogCoverPhotoName: storageRef.name,
			blogTitle: blogPost.title,
			blogDate: timestamp
		})

		setisLoading(false);

		editCurrentPost({
			id: "",
			title: "",
			blogHTML: "",
			blogCoverPhoto: "",
			blogCoverPhotoName: "",
			welcomeScreen: false
		})

		navigate(`/view-blog/${docRef.id}`)

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
	}), [])

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
			{modalActive && <BlogCoverPreview blogPhotoFileURL={blogPost.blogCoverPhoto} setModalActive={setModalActive} />}
			{isLoading && <Loading />}
			<div className="container">
				<div className={!error ? "err-message invisible" : "err-message"}>
					<p><span>Error: </span>{errorMsg}</p>
				</div>
				<div className="blog-info">
					<input type="text" value={blogPost.title} placeholder="Enter Blog Title"
						onChange={e => 
							editCurrentPost({
								...blogPost,
								title:  e.target.value
							})
							// setBlogPost(prevState => ({
							// 	...prevState,
							// 	title: e.target.value
							// }))
						}
					/>
					<div className="upload-file">
						<label htmlFor="blog-photo">Upload Cover Photo</label>
						<input type="file" id="blog-photo" onChange={coverHandler} accept=".jpg, .jpeg, .png, .webp, .gif" />
						<button onClick={() => setModalActive(true)} className={blogPost.blogCoverPhoto === "" ? "preview button-inactive" : "preview"}>Preview Photo</button>
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
				<div className="blog-actions">
					<button onClick={uploadHandler}>Publish Blog</button>
					<Link className="router-button" to="/blog-preview">Post Preview</Link>
				</div>
			</div>
		</div>
	)
}

export default CreatePost