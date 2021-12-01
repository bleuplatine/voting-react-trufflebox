import React from 'react'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Voting = (props) => {
  const { handleVote, proposalsList, onChangeTargetId } = props

  return (
    <div className="container mt-5">
      <Card className="text-center">
        <Card.Header className="fs-3 bg-light text-black"><i class="bi bi-check-circle-fill"> </i>
          Voter pour une proposition</Card.Header>
        <Card.Body>
          <Form onSubmit={handleVote}>
            <Form.Group className="text-start mb-3">
              {proposalsList &&
                proposalsList.map((a, i) =>
                  <Form.Check
                    key={i}
                    onChange={onChangeTargetId}
                    type="radio"
                    label={a[0]}
                    name="formRadios"

                    id={i}
                  />)
              }
            </Form.Group>
            <Form.Group >
              <Button className="text-uppercase" variant="info" type="submit">Voter</Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  )
}

export default Voting
