import './text.scss'
interface TextProp {
    text: string
}
const Text = ({ text }: TextProp) => <div>
    <p className="text-container">
        {text}
    </p>

</div>


export default Text