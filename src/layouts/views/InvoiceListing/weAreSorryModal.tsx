import React, { useEffect, useState } from "react";
import { Icon, Button, Modal } from "atlasuikit";

interface IModalProps {
    isOpen: boolean,
    onClose: () => void
}

export const WeAreSorryModal = ({
    isOpen,
    onClose
}: IModalProps) => {
    const [isActive, setIsActive] = useState<boolean>(false);

    useEffect(() => {
        if (isOpen !== isActive) {
            setIsActive(isOpen);
        }
    }, [isOpen])


    return (
        <Modal
            className="zero-padding"
            handleClose={onClose}
            width="32.5rem"
            height="auto"
            isOpen={isActive}
        >
            <div className='popup-modal-wrapper'>
                <div className='modal-heading'>
                    We’re Sorry!
                </div>
                <div className="modal-body">
                    This invoice has been voided and so there is no information to display.
                </div>
                <div className='modal-footer-action'>
                    <Button
                        className="primary-blue medium primary cancel-button"
                        data-testid="confirm-modal-button"
                        label="Okay"
                        handleOnClick={onClose}
                    />
                </div>
            </div>
        </Modal>
    )
}