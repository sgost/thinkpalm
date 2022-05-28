import {useState} from 'react';
import './input.scss'

export default function Input(props: any){

    const {value, setValue, minLength, maxLength, disable, className, placeholder, type, name, testid, label, required} = props;
    // const [value, setvalue] = useState(defaultValue);
    const masking = (e: any) => {
        if(type == "amount"){
            let pattern = /[0-9]/;
            if(!pattern.test(e.key)){
                e.preventDefault();
            }
        }
    }
    
    return(
        <div className='input-component'>
            <span className={'form-label' + (disable?' disable-label': '')}>{label}</span><span className='reds'>{required?'*':''}</span>
            <input
                value={value}
                type={type == "amount"?"text" : type}
                name={name}
                data-testid={testid}
                minLength={minLength}
                maxLength={maxLength}
                className={className + (disable ? " disable-input": '') }
                placeholder ={placeholder}
                disabled={disable}
                onChange={(e)=>{setValue(e.target.value)}}
                onKeyPress={(e)=>{masking(e)}}
            />
        </div>
    )
    
}