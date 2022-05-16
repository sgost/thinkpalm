import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "atlasuikit";
import "./FinishStepper.scss"

const FinishSTepper = () => {

    const navigate = useNavigate();

    return (
        <div className='finish-stepper-container'>
            <div className='finish-invoice-inner-container'>
                <div className='finish-header'>
                    <h3>Finish</h3>
                </div>
                <div className='finish-para-one'>
                    <p>You're done!</p>
                </div>
                <div className='finish-para-two'>
                    <p>
                        A new payroll invoice has been created. You can access it right from here or from the Invoice listing page.
                    </p>
                </div>
                <div className='finish-invoice-button'>
                    <Button
                        data-testid="Go_Invoice"
                        label="Go to Invoice"
                        className="primary-blue medium"
                        handleOnClick={() => { 
                            navigate("/pay");
                        }}
                    />
                </div>
            </div>

           
        </div>
    )
}

export default FinishSTepper