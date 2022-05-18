import {useEffect, useState, useContext} from 'react'
import { ctx, PaymentList } from '../../../App'
import { validateDates, validateAmount } from './validation'
import { calcMonthForMada } from '../../../services/madad'
type Error = {
    msg: string
}
type ErrorType = 'dateValidation' | 'amountValidation'

const Step4 = () => {
const { state, dispatch } = useContext(ctx)
const [errors, setErrors] = useState<Record<ErrorType,Error>>({'dateValidation':{msg: ''}, 'amountValidation': {msg: ''}})
useEffect(() => {
    const initPaymentList: PaymentList[] = []
    for (let i = 0; i < state.numberOfPayment; i++) {
        initPaymentList.push({ date:'', amount: 0, monthToCalc: '' })
    }
    dispatch({ action: 'setPaymentList', data: { paymentList: initPaymentList }})
},[])
useEffect(()=>{
    if (state.finishSteps) {
        const dateValidation = validateDates(state.paymentList)
        const amountValidation = validateAmount(state.paymentList, state.totalAmount)
        
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
        dispatch({action: 'finishSteps', data: {finishSteps: true}})


    }
},[state.finishSteps])

const setPaymentListDate = (date: string, index: number) => {
    const tempPaymentList = [...state.paymentList]
    tempPaymentList[index] = {...state.paymentList[index], date, monthToCalc: calcMonthForMada(date) }
    dispatch({ action: 'setPaymentList', data: { paymentList: tempPaymentList }})
}
const setPaymentListAmount = (amount: number, index: number) => {
    const tempPaymentList = [...state.paymentList]
    tempPaymentList[index] = {...state.paymentList[index], amount }
    dispatch({ action: 'setPaymentList', data: { paymentList: tempPaymentList }})
}
const payments = []
for (let i = 0; i < state.numberOfPayment; i++) {
    payments.push(
        <div key={`payment ${i}`} className="input-container"> 
            <div className="lable-wraper">
                <label htmlFor="date" >{i + 1} תשלום</label>
                <input name="date" id="date" type="date"  onChange={(event) => setPaymentListDate(event.target.value, i)} value={state.paymentList[i]?.date || ''}/>
            </div>
            <div className="lable-wraper">
                <label htmlFor="amount" >{i + 1} סכום</label>
                <input name="amount" id="amount" type="number"  onChange={(event) => setPaymentListAmount(+event.target.value, i)} value={state.paymentList[i]?.amount || ''}/>
            </div>
        </div>
        )
}
const errorsToDisplay = Object.values(errors || {}).map(error => <p className='error-msg'>{error.msg}</p>)
return <div className='step4-container'>
    {payments}
    {errorsToDisplay}

</div>
}


export default Step4