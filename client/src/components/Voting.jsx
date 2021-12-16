import React from 'react'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Voting = (props) => {
  const { handleVote, proposalsList, onChangeTargetId } = props

  return (
    <section className="bg-light py-5">
      <div className="container mt-5">
      
        <Card className="my-5 mx-auto text-center col-lg-9 border-info">
          <Card.Header className="py-3 fs-3 bg-info text-white"><i class="bi bi-check-circle-fill"> </i>
            Voter pour une proposition</Card.Header>
          <Card.Body>
            <Form onSubmit={handleVote}>
              <Form.Group className="text-start mb-3">
                {proposalsList &&
                  proposalsList.map((a, i) =>
                    <Form.Check className="mb-3"
                      key={i}
                      onChange={onChangeTargetId}
                      type="radio"
                      label={a[0]}
                      name="formRadios"
                      id={i}
                    />)
                }
              </Form.Group>
              <Form.Group className="text-center d-grid gap-2 py-2">
                <Button className="text-center btn-lg" variant="primary" type="submit">Voter</Button>
              </Form.Group>
            </Form>
          </Card.Body>
        </Card>

      </div>
    </section>
  )
}

export default Voting
