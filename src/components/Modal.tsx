import '../styles/Modal.css';

function Modal({ modalMessage, toggleModal }: {
	modalMessage: string;
	toggleModal: (value: boolean) => void;
}) {
	return (
		<div className="modal">
			<div className="modal-content">
				<p>{modalMessage}</p>
				<button onClick={() => toggleModal(false)}>Close</button>
			</div>
		</div>
	)
}

export default Modal;