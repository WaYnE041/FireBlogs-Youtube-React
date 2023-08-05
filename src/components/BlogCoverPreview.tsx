import '../styles/BlogCoverPreview.css';
import { ReactComponent as Close } from '../assets/Icons/times-circle-light.svg';

function BlogCoverPreview({ blogPhotoFileURL, toggleModal }: {
	blogPhotoFileURL: string;
	toggleModal: (value: boolean) => void;
}) {
	return (
		<div className="modal">
			<div className="modal-content">
				<Close className="icon" onClick={() => toggleModal(false)} />
				<img src={blogPhotoFileURL} alt="Cover Photo Preview" />
			</div>
		</div>
	)
}

export default BlogCoverPreview;