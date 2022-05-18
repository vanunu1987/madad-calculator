import {madadAxios} from './axios'
import {PaymentList} from '../App'
type Data = {
    data: MadadRes
}
type MadadRes = {
    month: DateInMonth[]
}
type DateInMonth = {
    date: CurrBase[]
}
type CurrBase = {
    currBase: Record<Value, number>
}
type Value = 'value'

export const getMadaByMonth = async (dateForMadad: string) => {
    const { data }: Data = await madadAxios.get('/',{params: { startPeriod: dateForMadad, endPeriod: dateForMadad }})
    const { month } = data
    const [currMonth] = month || []
    const { date } = currMonth || {}
    const [currDate] = date || []
    const { currBase } = currDate || {}

    return currBase?.value
}

export const getMadadForPaymentList = async (paymentList: PaymentList[], predictMada: number) => {
    if (!paymentList.length) return paymentList
    let newPaymentList: PaymentList[] = []
    const dateNow = calcMonthForMada(null)
    for (let i = 0 ;  i < paymentList.length; i++) {
    if (!paymentList[i].madad || isDateAbove(dateNow,paymentList[i].monthToCalc)) {
        let madad = await getMadaByMonth(reduceMadaToCalc(paymentList[i].monthToCalc, 1))
        if (!madad) {
            madad = await getMadadDiff(paymentList[i].date, predictMada)
        }
        newPaymentList.push({...paymentList[i], madad})
    } else {
        newPaymentList.push({...paymentList[i]})
    }        
    }
    return newPaymentList
}

export const reduceMadaToCalc = (madadToCalc: string, amountToReDuce: number) => {
    if (!madadToCalc) return madadToCalc
    const [month, year] = madadToCalc.split('-')
    return getRealDate(+month, +year, amountToReDuce)
}

const isDateAbove = (date1: string, date2: string) => {
    if (!date1 || !date2) return false
    const [month1, year1] = date1.split('-')
    const [month2, year2] = date2.split('-')
    if ((year2 > year1) || (year2 === year1 && month2 > month1) ) return true
    return false
}

export const calcMonthForMada = (date: string | null) => {
    const dateObj = date && new Date(date) || new Date()
    const year = dateObj.getMonth() ? dateObj.getFullYear() : dateObj.getFullYear() - 1
    const month = dateObj.getMonth() || 12
    const day = dateObj.getDate()
    if (day > 15) {
        return getRealDate(month + 1,year, 0)
    }
    return getRealDate(month ,year, 0)
}

const parsedNumbers = (number: number) => {
    if (number >= 10 ) {
        return '' + number
    }
    return '0' + number
}

export const calcMadadInterest = (amount: number, baseMadad: number, currMadad: number) => {
    return (amount * currMadad) / baseMadad
} 

export const getPredictMadad = async () => {
    const dateNow = calcMonthForMada(null)
    let madadToday = await getMadaByMonth(dateNow)
    if (!madadToday) {
        const [month,year] = dateNow.split('-')
        madadToday = await getMadaByMonth(getRealDate(+month, +year, 1))
    }
    let sum = madadToday
    const dateObj = new Date()
    const year = dateObj.getFullYear()
    const month = dateObj.getMonth() || 12
    let i = 5
    const realDate = getRealDate(month, year, i)
    sum -= await getMadaByMonth(realDate)
    return +(sum / (i)).toFixed(2)
} 
const getRealDate = (month: number, year: number, diff: number) => {
    if (month > 12) {
        month -= 12
        year++
    }
    
    if (month - diff > 0) {
        return `${parsedNumbers(month - diff)}-${year}`
    }else {
        return `${parsedNumbers(12 + month - diff)}-${year - 1}`
    }
}

export const getMadadDiff = async (diffDate: string, predictMadad: number) => {
    const dateNow = calcMonthForMada(null)
    let dateNowDiff = 0
    let madadToday = await getMadaByMonth(dateNow)
    if (!madadToday) {
        const [month,year] = dateNow.split('-')
        madadToday = await getMadaByMonth(getRealDate(+month, +year, 1))
        dateNowDiff++
    }
    const dateDiffObj = new Date(diffDate)
    const dateNowObj = new Date()
    let monthDiffNum = monthDiff(dateNowObj,dateDiffObj)
    monthDiffNum += dateNowDiff

    return +(madadToday + (predictMadad * monthDiffNum )).toFixed(2)
}

const monthDiff = (d1: Date, d2: Date) => {
    let months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth();
    months += d2.getMonth();
    if (d2.getDate() < 15) {
        months -=1
    }

    return months <= 0 ? 0 : months;
}