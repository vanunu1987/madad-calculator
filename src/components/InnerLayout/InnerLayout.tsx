import React ,{ useContext, useEffect, useState } from 'react';
import Text from './Text'
import { ctx } from '../../App'
import Step0 from './innerComponent/step1';
import Step1 from './innerComponent/step2';
import Step2 from './innerComponent/step3';
import Step3 from './innerComponent/step4';
import Results from './innerComponent/results/results';
import './InnerLayout.scss'

const InnerLayout = () => {
    const { state, dispatch } = useContext(ctx)
    useEffect(() => {
        switch (state.step) {
            case 0:
                setStepToRender(<Step0/>)
                break 
            case 1:
                setStepToRender(<Step1/>)
                break 
            case 2:
                setStepToRender(<Step2/>)
                break 
            case 3:
                setStepToRender(<Step3/>)
                break 
            case 4:
                setStepToRender(<Results/>)
                break 
            default:
                setStepToRender(<Step0/>)
                break 
        }
    },[state.step])

    const [stepToRender, setStepToRender] = useState(<Step0/>)

    return  <div className='inner-layout-container'>
                <Text text={state.textAccordingToStep[state.step]} />
                {stepToRender}
            </div>
}

export default InnerLayout