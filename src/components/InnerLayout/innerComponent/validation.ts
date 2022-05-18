import { PaymentList } from '../../../App'

export const validateDates = (paymentList: PaymentList[]) => {
    const isAllDatesNotFull = paymentList.some(paymentObj => !paymentObj.date)
    const datesIsNotInOrder = paymentList.some((paymentObj, idx) => {
        const index = idx ? idx - 1 : 0
        return new Date(paymentObj.date) < new Date(paymentList[index].date)
    })
    if (isAllDatesNotFull) {
        return { msg: 'נא הזינו את כל התאריכים', isValid: false}
    }
    if (datesIsNotInOrder) {
        return { msg: 'התאריכים לא מסודרים לפי הסדר, נא הזינו תאריכים בסדר עולה', isValid: false}
    }
    return {msg: '', isValid: true}
}
export const validateSignDate = (signDate: string) => {
    if (!signDate) {
        return { msg: 'נא הזינו את התאריך', isValid: false}
    }
    return {msg: '', isValid: true}
}
export const validateTotalAmount = (signDate: number) => {
    if (!signDate) {
        return { msg: 'נא הזינו את הסכום הכולל', isValid: false}
    }
    return {msg: '', isValid: true}
}

export const validateAmount = (paymentList: PaymentList[], totalAmount: number) => {
    const isAllDatesNotFull = paymentList.some(paymentObj => !paymentObj.amount)
    const isEqualToTotalAmount = paymentList.reduce((total,payment) => {
        return total + payment.amount
    }, 0) === totalAmount
        
    if (isAllDatesNotFull) {
        return { msg: 'נא הזינו את כל הסכומים לתשלום', isValid: false}
    }
    if (!isEqualToTotalAmount) {
        return { msg: 'סך התשלומים לא שווים לסכום החתימה', isValid: false}
    }
    
    return {msg: '', isValid: true}
}
export const validateNumberOfPayment = (numberOfPayment: number) => {
    if (numberOfPayment < 3) {
        return { msg: 'נא הזינו לפחות 3 תשלומים', isValid: false}
    }
    if (numberOfPayment > 8) {
        return { msg: 'נא הזינו עד 8 תשלומים', isValid: false}
    }
    
    return {msg: '', isValid: true}
}