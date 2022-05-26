import {useState} from 'react';
import './input.scss'

export default function Input(props: any){

    const {value, setValue, minLength, maxLength, disable, className, placeholder, type, name, testid, label, required} = props;
    // const [value, setvalue] = useState(defaultValue);
    return(
        <div className='input-component'>
            <span className={'form-label' + (disable?' disable-label': '')}>{label}</span><span className='reds'>{required?'*':''}</span>
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
                onChange={(e)=>{setValue(e.target.value)}}

            />
        </div>
    )
    
}