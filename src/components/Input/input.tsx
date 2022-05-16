import {useState} from 'react';
import './input.scss'

export default function Input(props: any){

    const {defaultValue, minLength, maxLength, disable, className, placeholder, type, name, testid, label} = props;
    const [value, setvalue] = useState(defaultValue);
    return(
        <div className='input-component'>
            <span className={'form-label' + (disable?' disable-label': '')}>{label}</span>
            <input
                value={value}
                type={type}
                name={name}
                data-testid={testid}
                minLength={minLength}
                maxLength={maxLength}
                className={className + (disable ? " disable-input": '') }
                placeholder ={placeholder}
                disabled={disable}
                onChange={(e)=>{setvalue(e.target.value)}}

            />
        </div>
    )
    
}