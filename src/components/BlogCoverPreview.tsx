import '../styles/BlogCoverPreview.css'
import { ReactComponent as Close } from '../assets/Icons/times-circle-light.svg'

function BlogCoverPreview({ blogPhotoFileURL, setModalActive }: { 
    blogPhotoFileURL: string, 
    setModalActive: (active: boolean) => void, 
}) {
  return (
    <div className="modal">
        <div className="modal-content">
            <Close className="icon" onClick={() => setModalActive(false)} />
            
            <img src={blogPhotoFileURL} alt="Cover Photo Preview" />
        </div>
    </div>
  )
}

export default BlogCoverPreview