import { Cards, Button, Dropdown } from 'atlasuikit';
import { useState } from 'react';
import Input from 'src/components/Input/input';
import "./creditMemoSummary.scss";
export default function CreditMemoSummary(props: any) {
    const [serviceDate, setServiceDate] = useState('');
    const [openProductService, setOpenProductService] = useState(false);
    return (
        <div className="credit-summary-wrapper">
            <Cards className="summary-card">
                <div className='top'>
                    <span className='title'>Summary</span>
                    <Button
                        className="primary-blue medium edit"
                        icon={{
                            color: '#fff',
                            icon: 'edit',
                            size: 'medium'
                        }}
                        label="Edit"
                    />
                </div>
                <div className='UI-align-boxes'>
                    <div className='UI-line-text-box'>
                        <Input
                            defaultValue=""
                            label="Service Date"
                            type="text"
                            disable={true}
                            name="service-date-input"
                            placeholder="Please enter"
                        ></Input>
                    </div>
                    <div className='UI-line-text-box'>
                        <Dropdown
                            handleDropOptionClick={function noRefCheck(){}}
                            handleDropdownClick={setOpenProductService}
                            isOpen={openProductService}
                            name="Flavours1"
                            isDisabled={true}
                            options={[
                                {
                                isSelected: false,
                                label: 'Chocolate',
                                value: 'chocolate'
                                },
                                {
                                isSelected: false,
                                label: 'Strawberry',
                                value: 'strawberry'
                                },
                                {
                                isSelected: false,
                                label: 'Vanilla',
                                value: 'vanilla'
                                }
                            ]}
                            title="Product Service"
                        />
                    </div>
                    <div className='UI-line-text-box'>
                        <Input
                            defaultValue=""
                            label="Description"
                            type="text"
                            name="service-date-input"
                            placeholder="Please enter"
                            disable={true}
                        ></Input>
                    </div>
                    <div className='UI-line-text-box'>
                        <Input
                            defaultValue=""
                            label="Service Country"
                            type="text"
                            name="service-date-input"
                            placeholder="Please enter"
                            disable={true}
                        ></Input>
                    </div>
                </div>
                <div className='UI-align-boxes margin-top-4'>
                    <div className='quantity-box'>
                        <Input
                            defaultValue=""
                            label="Quantity"
                            type="number"
                            name="service-date-input"
                            placeholder="Please enter"
                            disable={true}
                        ></Input>
                    </div>
                    <div className='amount-box'>
                        <Input
                            defaultValue=""
                            label="Amount"
                            type="number"
                            name="service-date-input"
                            placeholder="Please enter"
                            disable={true}
                        ></Input>
                    </div>
                    <div className='UI-line-text-box'>
                        <Input
                            defaultValue=""
                            label="Total Amount"
                            type="number"
                            name="service-date-input"
                            placeholder="Please enter"
                            disable={true}
                        ></Input>
                    </div>
                </div>
                <div className='line-between'></div>
            </Cards>
        </div>
    )
}