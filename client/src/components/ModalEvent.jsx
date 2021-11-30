import React from 'react'
import Modal from 'react-bootstrap/Modal';


const ModalEvent = (props) => {
  const { showEvent, messageEvent, fct } = props
  return (
    <>
      <Modal
        show={showEvent}
        onHide={fct}
        dialogClassName="modal-90w"
        aria-labelledby="alert-modal">
        <Modal.Header closeButton className="bg-success text-white">
          <Modal.Title id="alert-modal">
            <i class="bi bi-check-square-fill"></i> VALIDATION
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-success text-white bg-opacity-75 fs-4">{messageEvent}</Modal.Body>
      </Modal>
    </>
  )
}

export default ModalEvent
