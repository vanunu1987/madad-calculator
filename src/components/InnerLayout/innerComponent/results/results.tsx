import {useEffect, useState, useContext} from 'react'
import { ctx } from '../../../../App'
import ResultItem from './ResultsItem'
import {getMadadForPaymentList, getMadaByMonth, calcMadadInterest, calcMonthForMada, getMadadDiff, getPredictMadad, reduceMadaToCalc} from '../../../../services/madad'
import './results.scss'
const Results = () => {
const { state, dispatch } = useContext(ctx)
useEffect( () => {
    (async function() {
        try {
            const dateForSignDay = calcMonthForMada(state.signDate)
            let madadForSignDay = await getMadaByMonth(reduceMadaToCalc(dateForSignDay, 1))
            if (!madadForSignDay) {
                madadForSignDay = await getMadadDiff(state.signDate, state.predictMadad)
            }
            dispatch({ action: 'setMadadForSignDay', data: {madadForSignDay} })
            localStorage.setItem('localState', JSON.stringify({...state, madadForSignDay }))
            
            const updatePaymentList = await getMadadForPaymentList(state.paymentList, state.predictMadad)
            dispatch({ action: 'setPaymentList', data: {paymentList: updatePaymentList} })
            localStorage.setItem('localState', JSON.stringify({...state, paymentList: updatePaymentList }))
        } catch (e) {
            console.error(e);
        }
    })();
},[state.predictMadad])

useEffect(() => {
    (async function() {
        try {
            const predictMadad = await getPredictMadad()
            dispatch({ action: 'setPredictMadad', data: {predictMadad} })
            localStorage.setItem('localState', JSON.stringify({...state, predictMadad }))
        } catch (e) {
            console.error(e);
        }
    })();
  }, []);

const resultsList = state.paymentList.map(payment => <ResultItem 
    key = {payment.date} 
    dateToPay = {payment.date}
    amount = {payment.amount}
    interestAmount = {payment.madad || 0}
    interestPresent = {Math.floor(calcMadadInterest(payment.amount, state.madadForSignDay, payment.madad || 1))} 
    amountOfInterest = {Math.floor(calcMadadInterest(payment.amount, state.madadForSignDay, payment.madad || 1) - payment.amount)}
    />)
const totalIntrestAmount = state.paymentList.reduce((totalAmount, payment) => {
    totalAmount += Math.floor(calcMadadInterest(payment.amount, state.madadForSignDay, payment.madad || 1) - payment.amount)
    return totalAmount
}, 0 )
return <div className="results">
    <div className="header-text">
        <span>*מדד חזוי :{state.predictMadad}</span>
        <span>סכום תשלום כולל על מדד :{new Intl.NumberFormat('he-IN', { maximumSignificantDigits: 7, style: 'currency', currency: 'ILS' }).format(totalIntrestAmount)}</span>
    </div>
    {resultsList}
    <p className='bottom-calss'>
        * תוספת נק׳ חזויה במדד לחודש  (מחושב חצי שנה אחורה)
    </p>
</div>
}


export default Results