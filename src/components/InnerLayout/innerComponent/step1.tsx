import {useEffect, useState, useContext} from 'react'
import { ctx } from '../../../App'
const Step1 = () => {
const { state, dispatch } = useContext(ctx)
const [input, setInput] = useState(state.name)
useEffect(()=>{
    if (state.step === 1) {
        dispatch({ action: 'setName', data: {name: input } })
    }
},[state.step])
return <div className='step1-container'>
    <div className="lable-wraper">
        <label htmlFor="userName">שם</label>
        <input name="userName" type="text" onChange={(event) => setInput(event.target.value)} value={input}/>
    </div>

</div>
}


export default Step1