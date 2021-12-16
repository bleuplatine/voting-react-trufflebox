import React from 'react'
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const Workflow = (props) => {
  const { srcImg, workflowStatusId, statusWF, txtWF, actualAccount, statusButton, owner, handleWorkflow } = props
  return (
    <div className='bg-dark bg-gradient py-5'>

      <div className="container py-1">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <img className='float-start img-fluid' src={srcImg} alt="propA" width="500" height="500" loading="lazy" />
          </div>
          <div className="col-lg-7 ps-5 py-3 text-lg-start">
            <h1 className='fw-bold text-white mb-2'>{statusWF[workflowStatusId]}</h1>
            <div className="lead text-light mb-4">{txtWF[workflowStatusId]}</div>
            {(actualAccount ? actualAccount.toUpperCase() === owner.toUpperCase() : true) &&
            workflowStatusId < statusButton.length &&
            <Form>
              <Button className="text-uppercase" onClick={handleWorkflow}
                variant={/[13]/.test(workflowStatusId) ? "danger" : "success"} type="submit">
                <i className={/[13]/.test(workflowStatusId) ? "bi bi-stop-circle-fill" : "bi bi-play-circle-fill"}> </i>
                {workflowStatusId < statusButton.length ? statusButton[workflowStatusId] : "Terminé"}
              </Button>
            </Form>}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Workflow
