import React from 'react'
import { useNavigate } from "react-router-dom";
import { Button } from "atlasuikit";
import "./FinishStepper.scss"

const FinishSTepper = ({
    handleSteps,
    handleAllSteppersData,
    allStepsData,
}: any) => {

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
                        data-testid=""
                        label="Go to Invoice"
                        className="primary-blue medium"
                        handleOnClick={() => { 
                            navigate("/pay");
                        }}
                    />
                </div>
            </div>

            <div className='finish-previous-button'>
                <Button
                    data-testid=""
                    icon={{
                        icon: "chevronLeft",
                        size: "medium",
                        color: "#fff",
                    }}
                    className="primary-blue medium previous-button"
                    label="Previous"
                    handleOnClick={() => {
                        handleSteps(3);
                    }}
                />
            </div>
        </div>
    )
}

export default FinishSTepper