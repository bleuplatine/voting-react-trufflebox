import React from 'react'
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const Workflow = (props) => {
  const { srcImg, workflowStatusId, statusWF, actualAccount, statusButton, owner, handleWorkflow } = props
  return (
    <div className="container mt-5">
      <Card className="text-center">
        <Card.Img className="bg-white" variant="top" src={srcImg} />
        <Card.Header className="fs-1 bg-light text-dark text-uppercase">
          <strong>{statusWF[workflowStatusId]}</strong></Card.Header>
        {(actualAccount ? actualAccount.toUpperCase() === owner.toUpperCase() : true) &&
          workflowStatusId < statusButton.length &&
          <Card.Body>
            <Form>
              <Button className="text-uppercase" onClick={handleWorkflow}
                variant={/[13]/.test(workflowStatusId) ? "danger" : "success"} type="submit">
                <i class={/[13]/.test(workflowStatusId) ? "bi bi-stop-circle-fill" : "bi bi-play-circle-fill"}> </i>
                {workflowStatusId < statusButton.length ? statusButton[workflowStatusId] : "Terminé"}
              </Button>
            </Form>
          </Card.Body>}
      </Card>
    </div>
  )
}

export default Workflow
