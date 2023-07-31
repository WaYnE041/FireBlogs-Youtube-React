import '../styles/Modal.css'

function Modal({ modalMessage, setModalActive }: { 
    modalMessage: string | null, 
    setModalActive: (active: boolean) => void, 
}) {
  return (
    <div className="modal">
        <div className="modal-content">
            <p>{modalMessage}</p>
            <button onClick={() => setModalActive(false)}>Close</button>
        </div>
    </div>
  )
}

export default Modal