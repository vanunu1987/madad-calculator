import './lable.scss'
const label = ({lableText}: {lableText: string})=> {

    return <div className="lable-container">
        <span>{lableText}</span>
    </div>
}

export default label