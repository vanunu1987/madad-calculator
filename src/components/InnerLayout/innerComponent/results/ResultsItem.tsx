import Lable from './lable'
import "./ResultsItem.scss"
type  ResultsItemProps = {
    dateToPay: string,
    amount: number,
    interestAmount: number,
    interestPresent: number,
    amountOfInterest: number
}
const ResultsItem = ({dateToPay, amount, interestAmount, interestPresent, amountOfInterest}: ResultsItemProps) => {

return <div className="item">
<span>
    <Lable lableText='תאריך תשלום'/>
    <span>{dateToPay}</span> |
</span>
<span>
    <Lable lableText='סכום לתשלום'/>
    <span>{new Intl.NumberFormat('he-IN', { maximumSignificantDigits: 7, currency: 'ILS' }).format(amount)}</span> |
</span>
<span>
    <Lable lableText='מדד לתקופה (חזוי / קיים)'/>
    <span>{interestAmount}</span> |
</span>
<span>
    <Lable lableText='סכום כולל תוספת מדד'/>
    <span>{new Intl.NumberFormat('he-IN', { maximumSignificantDigits: 7, style: 'currency', currency: 'ILS' }).format(interestPresent)}</span> |
</span>
<span>
    <Lable lableText='תוספת מדד'/>
    <span>{new Intl.NumberFormat('he-IN', { maximumSignificantDigits: 7, style: 'currency', currency: 'ILS' }).format(amountOfInterest)}</span> |
</span>
</div>
}


export default ResultsItem