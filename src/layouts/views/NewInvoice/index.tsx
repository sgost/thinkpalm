import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BreadCrumb, Layouts, Progress } from "atlasuikit";
import NewInvoiceCreation from "./NewInvoiceCreation";
import SelectEmployees from "./SelectEmployees";
import PreviewInvoice from "./PreviewInvoice"
import "./index.scss";
import FinishSTepper from "./FinishStepper";

const NewInvoice = () => {
  const navigate = useNavigate();

  const [stepsCount, setStepsCount] = useState(3);
  const [hideTopCheck, setHideTopCheck] = useState(true);
  const [allStepsData, setAllStepsData] = useState({
    stepOneData: {
      customer: "",
      type: "",
      country: "",
      month: "",
      year: "",
      customerId: "",
    },
    stepTwoData: {},
    stepThreeData: {},
  });

  const stepsName = [
    {
      key: "new-invoice",
      label: "New Invoice",
    },
    {
      key: "select-employees",
      label: "Select Employees",
    },
    {
      key: "invoice-preview",
      label: "Invoice Preview",
    },
    {
      key: "finish",
      label: "FINISH!",
    },
  ];

  const handleSteps = (count: any) => {
    setStepsCount(count);
  };

  const handleAllSteppersData = (stepsData: any, count: any) => {
    if (count === 2) {
      setAllStepsData({ ...allStepsData, stepOneData: stepsData });
    } else if (count === 3) {
      setAllStepsData({ ...allStepsData, stepTwoData: stepsData });
    }
    // else if (count === 4) {
    //     setAllStepsData({ ...allStepsData, stepThreeData: stepsData })
    // }
  };

  useEffect(() => {
    if (!hideTopCheck) {
      navigate("/pay");
    }
  }, [hideTopCheck]);

  return (
    <div className="newinvoice-container">
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
              label: "New Invoice",
            },
          ]}
        />
      </div>
      <div className="detail-container">
        <Layouts
          config={{
            leftPanelConfig: {
              className: "",
              style: {},
            },
            rightPanelConfig: {
              className:
                stepsCount === 1
                  ? ""
                  : stepsCount === 2
                    ? "step2-right-panel"
                    : "",
            },
          }}
          leftPanel={
            <Progress
              currentStep={stepsCount}
              steps={stepsName}
              type="step-progress"
            />
          }
          type="sidebar-inner-container"
          rightPanel={
            <>
              {stepsCount == 1 ? (
                <NewInvoiceCreation
                  handleAllSteppersData={handleAllSteppersData}
                  handleSteps={handleSteps}
                  allStepsData={allStepsData}
                />
              ) : stepsCount == 2 ? (
                <SelectEmployees
                  handleAllSteppersData={handleAllSteppersData}
                  allStepsData={allStepsData}
                  handleSteps={handleSteps}
                />
              ) : stepsCount == 3 ? (
                <PreviewInvoice
                  handleAllSteppersData={handleAllSteppersData}
                  allStepsData={allStepsData}
                  handleSteps={handleSteps}
                />
              ) : stepsCount == 4 ? (
                <FinishSTepper
                  handleAllSteppersData={handleAllSteppersData}
                  allStepsData={allStepsData}
                  handleSteps={handleSteps}
                />
              ) : (
                <></>
              )}
            </>
          }
        />
      </div>
    </div>
  );
};

export default NewInvoice;
