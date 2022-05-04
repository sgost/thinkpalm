import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BreadCrumb, Layouts, Progress, Button } from "atlasuikit";
import NewInvoiceCreation from './NewInvoiceCreation';
import SelectEmployees from './SelectEmployees';
import './index.scss'

const NewInvoice = () => {

    const navigate = useNavigate();

    const [stepsCount, setStepsCount] = useState(2)
    const [hideTopCheck, setHideTopCheck] = useState(true);

    const stepsName = [{
        key: 'new-invoice',
        label: 'New Invoice'
    }, {
        key: 'select-employees',
        label: 'Select Empolyees'
    },
    {
        key: 'invoice-preview',
        label: 'Invoice Preview'
    },
    {
        key: 'finish',
        label: 'FINISH!'
    }]

    const handleSteps = (count: any) => {
        setStepsCount(count)
    }

    useEffect(() => {
        if (!hideTopCheck) {
            navigate("/pay");
        }
    }, [hideTopCheck]);

    return (
        <div className='newinvoice-container'>
            <div className="breadcrumbs">
                <BreadCrumb
                    hideHeaderTitle={hideTopCheck}
                    hideHeaderTabs={hideTopCheck}
                    steps={[
                        {
                            isActive: true,
                            key: "Invoices",
                            label: "Invoices",
                            onClickLabel: () => {
                                setHideTopCheck(false);
                            },
                        },
                        {
                            key: "profile",
                            label: "New Invoice"
                        },
                    ]}
                />
            </div>
            <div className='detail-container'>
                <Layouts
                    leftPanel={
                        <Progress currentStep={stepsCount}
                            steps={stepsName}
                            type="step-progress"
                        />
                    }
                    type="sidebar-inner-container"
                    rightPanel={
                        <>

                            {stepsCount == 1 ?

                                <NewInvoiceCreation handleSteps={handleSteps} />
                                :
                                stepsCount == 2 ? <SelectEmployees handleSteps={handleSteps} style={{}} />
                                    :
                                    <></>
                            }
                        </>
                    }
                />
            </div>

        </div>
    )
}

export default NewInvoice