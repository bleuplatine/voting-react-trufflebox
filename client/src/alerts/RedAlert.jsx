import React, { useState } from 'react'
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';



const RedAlert = (props) => {
  const { status } = props
  const [showAlert, setShowAlert] = useState(status)

  // const [show, setShow] = useState(true);

  if (showAlert) {
    return (
      <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>
        <Alert.Heading>Adresse déjà enregistrée !</Alert.Heading>

      </Alert>
    );
  }
}

export default RedAlert
