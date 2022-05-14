import {useEffect, useState, useContext} from 'react'
import { ctx } from '../../../App'
import { validateNumberOfPayment } from './validation'
type Error = {
    msg: string
}
type ErrorType = 'amountValidation'
const Step3 = () => {
const { state, dispatch } = useContext(ctx)
const [numberOfPayment, setNumberOfPayment] = useState(state.numberOfPayment)
const [errors, setErrors] = useState<Record<ErrorType,Error>>({'amountValidation': {msg: ''}})
useEffect(()=>{
    if (state.finishSteps) {
        const amountValidation = validateNumberOfPayment(numberOfPayment)
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
    if (state.step === 3) {
        dispatch({ action: 'setNumberOfPayment', data: { numberOfPayment } })
    }
},[state.step])
const errorsToDisplay = Object.values(errors || {}).map(error => <h3>{error.msg}</h3>)
return <div className='step3-container'>
    <div className="input-container">
        <div className="lable-wraper">
            <label htmlFor="quantity" >מספר פעימות</label>
            <input name="numberOfPayment" id="quantity" type="number" min={0} max={10} onChange={(event) => setNumberOfPayment(+event.target.value)} value={numberOfPayment}/>
        </div>
        {errorsToDisplay}
    </div>
</div>
}


export default Step3