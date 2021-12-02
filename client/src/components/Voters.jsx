import React from 'react'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import ListGroup from 'react-bootstrap/ListGroup';

const Voters = (props) => {
  const { contentForm, refAddress, votersList, plusVoter, onChangeTargetValue } = props

  return (
    <div className="container mt-5">
      <Card className="text-center">
        <Card.Header className="fs-3 bg-light text-black"><i class="bi bi-person-plus-fill"> </i>
          Enregistrer un nouveau voteur</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formAddress">
              <Form.Label>Saisir une adresse Ethereum</Form.Label>
              <InputGroup>
                <InputGroup.Text id="inputAddress"><i class="bi bi-at"></i></InputGroup.Text>
                <Form.Control type="text" ref={refAddress} aria-describedby="inputAddress"
                  value={contentForm} onChange={onChangeTargetValue} />
              </InputGroup>
            </Form.Group>

            <Button className="text-uppercase" onClick={plusVoter} variant="info" type="submit">
              Enregistrer
            </Button>
          </Form>
        </Card.Body>

        {votersList[0] &&
          <>
            <Card.Footer className="fs-3 bg-light text-black"><i class="bi bi-people-fill"> </i>
              Liste des comptes autorisés</Card.Footer>
            <ListGroup variant="flush">
              {votersList &&
                votersList.map((a, i) => <ListGroup.Item key={i}>{a[1]}</ListGroup.Item>)
              }
            </ListGroup>
          </>}
      </Card>
    </div>
  )
}

export default Voters
