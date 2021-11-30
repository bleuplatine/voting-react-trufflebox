import React from 'react'
import Modal from 'react-bootstrap/Modal';


const ModalAlert = (props) => {
  const { showAlert, messageAlert, fct } = props
  return (
    <>
      <Modal
        show={showAlert}
        onHide={fct}
        dialogClassName="modal-90w"
        aria-labelledby="alert-modal">
        <Modal.Header closeButton className="bg-warning text-black">
          <Modal.Title id="alert-modal">
            <i class="bi bi-exclamation-octagon-fill"></i> ALERTE
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="bg-warning text-black bg-opacity-75 fs-4">{messageAlert}</Modal.Body>
      </Modal>
    </>
  )
}

export default ModalAlert
