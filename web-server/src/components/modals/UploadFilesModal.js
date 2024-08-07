import { Modal } from "react-bootstrap";
import UploadOrReceiveArea from "../UploadOrReceiveArea";
import { useContext, useEffect, useRef, useState } from "react";
import StorageFullError from "../../errors/StorageFullError";
import { ApplicationContext } from "../../providers/ApplicationProvider";


export default function UploadFilesModal({ show, onDone, onCancel, onFilesChange, showFilePickerOnShow }) {
    const [files, setFiles] = useState([])
    const { setShowStorageFullModal } = useContext(ApplicationContext)

    const onFilesSelected = (newFiles) => {
        console.log(newFiles)
        setFiles([...files, ...newFiles])
        onFilesChange && onFilesChange([...files, ...newFiles])
    }

    const removeFile = (file) => {
        setFiles(files.filter(f => f != file))
        onFilesChange && onFilesChange(files.filter(f => f != file))
    }

    useEffect(() => {
        if(show) {
            if(showFilePickerOnShow) {
                // selectFilesRef.current.click()
            }
            setFiles([])
            onFilesChange && onFilesChange([])
        }
    }, [show])

    const FileScrollerEntry = ({ file }) => {
        return (
            <div className="d-flex flex-row bg-dark-subtle flex-shrink-0">
                <div className="border-start border-top border-bottom rounded-start p-2 pe-1">
                    {file.name}
                </div>
                <div className="border-end  border-top border-bottom rounded-end p-2 ps-1">
                    <a className="link-danger" href="#" onClick={() => removeFile(file)}><i className="bi bi-x-lg m-auto"></i></a>
                </div>
            </div>
        )
    }

    const onDoneClicked = () => {
        onDone(files).then(() => {
            
        }).catch(err => {
            console.log(err)
            if(err instanceof StorageFullError) {
                setShowStorageFullModal(true)
            }
        })
    }

    return (
        <>
            <Modal show={show} backdrop="static" centered onHide={onCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Add files</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-row gap-1 overflow-x-scroll">
                        { files.map(f => {
                            return <FileScrollerEntry key={f.name + f.lastmodified + f.size + f.type} file={f}/>
                        }) }
                    </div>
                    <div className="d-flex" style={{ minHeight: "200px" }}>
                        <UploadOrReceiveArea title={"Pick files"} allowFolders={true}
                            allowReceive={false} onFilesSelected={onFilesSelected}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={onDoneClicked} className="btn btn-primary">Done</button>
                </Modal.Footer>
            </Modal>
        </>
    )
}