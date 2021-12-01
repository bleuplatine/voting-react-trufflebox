import React from 'react'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';

const Proposals = (props) => {
  const { contentForm, refProposal, proposalsList, plusProposal, onChangeTargetValue } = props

  return (
    <div className="container mt-5">
      <Card className="text-center">
        <Card.Header className="fs-3  bg-light text-black"><i class="bi bi-chat-right-text"> </i>
          Enregistrer une nouvelle proposition</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Décrire votre proposition</Form.Label>
              <InputGroup>
                <InputGroup.Text id="inputAddress"><i class="bi bi-pen"></i></InputGroup.Text>
                <Form.Control type="text" ref={refProposal}
                  value={contentForm} onChange={onChangeTargetValue} />
              </InputGroup>
            </Form.Group>

            <Button className="text-uppercase" onClick={plusProposal} variant="info" type="submit">
              Enregistrer
            </Button>
          </Form>
        </Card.Body>

        {proposalsList[0] &&
          <>
            <Card.Header className="fs-3  bg-light text-black"><i class="bi bi-list-task"> </i>
              Liste des propositions</Card.Header>
            <ListGroup variant="flush">
              {proposalsList &&
                proposalsList.map((a, i) => <ListGroup.Item key={i}>{a[0]}</ListGroup.Item>)
              }
            </ListGroup>
          </>}
      </Card>
    </div>
  )
}

export default Proposals
