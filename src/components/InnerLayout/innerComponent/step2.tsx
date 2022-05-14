import {useEffect, useState, useContext} from 'react'
import { ctx } from '../../../App'
import { validateSignDate, validateTotalAmount } from './validation'
import './steps.scss'
type Error = {
    msg: string
}
type ErrorType = 'dateValidation' | 'amountValidation'
const Step2 = () => {
const { state, dispatch } = useContext(ctx)
const [signDate, setSignDate] = useState('')
const [totalAmount, setTotalAmount] = useState(state.totalAmount)
const [errors, setErrors] = useState<Record<ErrorType,Error>>({'dateValidation':{msg: ''}, 'amountValidation': {msg: ''}})

useEffect(()=>{
    if (state.finishSteps) {
        const dateValidation = validateSignDate(signDate)
        const amountValidation = validateTotalAmount(totalAmount)
        
        if (!dateValidation.isValid) {
            setErrors(prevErrors => ({...prevErrors ,dateValidation: {msg: dateValidation.msg} }))
            dispatch({action: 'finishSteps', data: {finishSteps: false}})
            return
        }
        setErrors(prevErrors => ({...prevErrors ,dateValidation: {msg: ''} }))
        if (!amountValidation.isValid) {
            setErrors(prevErrors => ({...prevErrors ,amountValidation: {msg: amountValidation.msg} }))
            dispatch({action: 'finishSteps', data: {finishSteps: false}})
            return
        }
        setErrors(prevErrors => ({...prevErrors ,amountValidation: {msg: ''} }))
        dispatch({action: 'incStep'})
        dispatch({action: 'finishSteps', data: {finishSteps: false}})


    }
},[state.finishSteps])
useEffect(()=>{
    if (state.step === 2) {
        dispatch({ action: 'setSignDate', data: { signDate } })
        dispatch({ action: 'setTotalAmount', data: { totalAmount } })
    }
},[state.step])
const errorsToDisplay = Object.values(errors || {}).map(error => error.msg ? <p className='error-msg'>{error.msg}</p> : '')
return <div className='step2-container'>
    <div className="input-container">
        <div className="lable-wraper">
            <label htmlFor="signDate">תאריך חתימת חוזה</label>
            <input name="signDate" type="date" onChange={(event) => setSignDate(event.target.value)} value={signDate}/>
        </div>
        <div className="lable-wraper">
            <label htmlFor="totalAmount">סכום מלא לתשלום</label>
            <input name="totalAmount" type="number"  onChange={(event) => setTotalAmount(+event.target.value)} value={totalAmount || ''}/>
        </div>
    </div>
    {errorsToDisplay}
</div>
}


export default Step2