import React from 'react'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';

import ethereum from "../img/ethereum.svg";


const Voters = (props) => {
  const { contentForm, refAddress, votersList, plusVoter, onChangeTargetValue } = props

  return (
    <section className="bg-light py-5">
      <div className="container mt-5">

        <div className="container my-5">
          <div className="text-center mb-5">
            <div className="fs-3 d-inline-flex bg-info text-white rounded-3 mb-3 px-3 py-2">
              <i className="bi bi-person-plus-fill"></i></div>
            <h2 className="fw-bolder">Enregistrer un nouveau voteur</h2>
            <p className="lead mb-0">Section réservée à l'administrateur</p>
          </div>

          <div className="row justify-content-center pb-4">
            <div className="col-lg-6">
              <Form className="text-center d-grid gap-2">
                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Saisir une adresse Ethereum valide</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text id="inputAddress">
                      <img src={ethereum} alt="" height="20" />
                    </InputGroup.Text>
                    <Form.Control type="text" ref={refAddress} aria-describedby="inputAddress"
                      value={contentForm} onChange={onChangeTargetValue}
                      isInvalid={!/^0x[a-fA-F0-9]{40}$/.test(contentForm)}
                      isValid={/^0x[a-fA-F0-9]{40}$/.test(contentForm)}
                    />
                  </InputGroup>
                </Form.Group>

                <Button className="text-center btn-lg" onClick={plusVoter} variant="primary" type="submit">
                  Enregistrer
                </Button>
              </Form>
            </div>
          </div>
        </div>


        {votersList[0] &&
          <Card className="my-5 mx-auto text-center col-lg-6 border-info">
            <Card.Header className="py-3 fs-3 bg-info text-white"><i class="bi bi-people-fill"> </i>
              Liste des comptes autorisés</Card.Header>
            <ListGroup variant="flush">
              {votersList &&
                votersList.map((a, i) => <ListGroup.Item key={i}>{a[1]}</ListGroup.Item>)}
            </ListGroup>
          </Card>}

      </div>
    </section>
  )
}

export default Voters
