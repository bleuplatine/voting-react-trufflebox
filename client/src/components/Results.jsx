import React from 'react'
import Card from 'react-bootstrap/Card';
import Table from 'react-bootstrap/Table';
import ListGroup from 'react-bootstrap/ListGroup';

const Results = (props) => {
  const { winnersList, proposalsList } = props

  return (
    <section className="bg-light py-5">
      <div className="container mt-5">

        <section className="py-4 border-bottom">
          <div className="container px-5 ">
            <div className="text-center mb-5">
              <h2 className="fw-bolder">Proposition(s) adoptée(s)</h2>
            </div>

            <div className="row gx-5 justify-content-center">
              <div className="col-lg-7">

                <div className="card mb-4 bg-primary">
                  <div className="card-body p-4">
                    <div className="d-flex">
                      <div className="flex-shrink-0"><i className="bi bi-trophy-fill text-primary fs-1 text-secondary"></i></div>
                      <div className="ms-3">
                        <ListGroup variant="flush" className="fs-5">
                          {winnersList &&
                            winnersList.map((a, i) => <ListGroup.Item className="mb-1 text-start bg-primary text-white" key={i}>{a[0]}</ListGroup.Item>)
                          }
                        </ListGroup>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        <Card className="text-center my-5  border border-info">
          <Card.Header className="fs-3 bg-info text-white"><i class="bi bi-sort-numeric-down"> </i>
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
                  .map((a, i) => <tr key={i}><td>{a[1]}</td><td className='text-start'>{a[0]}</td></tr>)
              }
            </tbody>
          </Table>
        </Card>
      </div>
    </section>
  )
}

export default Results
