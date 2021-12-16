import React from 'react'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';
import FloatingLabel from 'react-bootstrap/FloatingLabel';

const Proposals = (props) => {
  const { contentForm, refProposal, proposalsList, plusProposal, onChangeTargetValue } = props

  return (
    <section className="bg-light py-5">
      <div className="container mt-5">

        <div className="container my-5">
          <div className="text-center mb-5">
            <div className="fs-3 d-inline-flex bg-info text-white rounded-3 mb-3 px-3 py-2">
              <i className="bi bi-chat-right-text"></i></div>
            <h2 className="fw-bolder">Enregistrer une nouvelle proposition</h2>
          </div>

          <div className="row justify-content-center pb-4">
            <div className="col-lg-6">
              <Form className="text-center d-grid gap-2">
                <Form.Group className="mb-3" controlId="formAddress">
                  <Form.Label>Saisir une proposition conforme aux conditions du SNP</Form.Label>
                  <FloatingLabel controlId="floatingTextarea2" >
                    <Form.Control
                      ref={refProposal}
                      value={contentForm} onChange={onChangeTargetValue}
                      as="textarea"
                      style={{ height: '100px' }}
                    />
                  </FloatingLabel>
                </Form.Group>

                <Button className="text-center btn-lg" onClick={plusProposal} variant="primary" type="submit">
                  Enregistrer
                </Button>
              </Form>
            </div>
          </div>
        </div>

        {proposalsList[0] &&
          <Card className="my-5 mx-auto text-center col-lg-6 border-info">
            <Card.Header className="py-3 fs-3 bg-info text-white"><i class="bi bi-list-task"> </i>
              Liste des propositions</Card.Header>
            <ListGroup variant="flush">
              {proposalsList &&
                proposalsList.map((a, i) => <ListGroup.Item key={i}>{a[0]}</ListGroup.Item>)}
            </ListGroup>
          </Card>}

      </div>
    </section >
  )
}

export default Proposals
