import React from 'react'
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';

const Results = (props) => {
  const { winnersList, proposalsList } = props

  return (
    <div className="container mt-5">
      <Card className="text-center">
        <Card.Header className="fs-3 bg-light text-black"><i class="bi bi-trophy-fill"> </i>
          Proposition(s) adoptée(s)</Card.Header>
        <ListGroup variant="flush" className="fs-4">
          {winnersList &&
            winnersList.map((a, i) => <ListGroup.Item className="bg-info" key={i}>{a[0]}</ListGroup.Item>)
          }
        </ListGroup>
      </Card>
      <Card className="text-center mt-5">
        <Card.Header className="fs-3 bg-light text-black"><i class="bi bi-sort-numeric-down"> </i>
          Résultats des votes</Card.Header>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Nombre de votes</th>
              <th>Propositions</th>
            </tr>
          </thead>
          <tbody>
            {proposalsList &&
              [...proposalsList]
                .sort((a, b) => !b[1] - !a[1] || b[1] - a[1])
                .map((a, i) => <tr key={i}><td>{a[1]}</td><td>{a[0]}</td></tr>)
            }
          </tbody>
        </Table>
      </Card>
    </div>
  )
}

export default Results
