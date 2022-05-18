import React, {useContext, useEffect} from 'react';
import './App.css';
import Steps from './components/steps'
import Layout from './components/Layout'
import  Header  from './components/Header';

const defaultState: State = {
  step: 0,
  name: 'אורח',
  numberOfPayment: 0,
  signDate: '01/01/2021',
  madadForSignDay: 0,
  paymentList: [],
  textAccordingToStep: [
    'היי, בוא נחשב את רביות ההצמדה שלכם ב3 שלבים פשוטים, רק אם תוכלו לתת קצת פרטים',
    'נהדר, עכשיו הכניסו את תאריך חתימת החוזה ושווי ערך הדירה במעמד החתימה',
    'מעולה, עכשיו הזינו את כמות תשלומים',
    'מצויין! עכשיו הזינו את התאריכים והתשלום  המובקש לאותו התאריך'
  ],
  totalAmount: 0,
  finishSteps: false,
  predictMadad: 1
}

export type PaymentList = {
  date: string,
  amount: number,
  madad?: number,
  monthToCalc: string
}

type State = {
  step: number;
  name: string;
  numberOfPayment: number;
  signDate: string;
  paymentList: PaymentList[],
  textAccordingToStep: string[],
  totalAmount: number,
  finishSteps: boolean,
  madadForSignDay: number,
  predictMadad: number
}

type ReducerParams = {
  action: action;
  data?: Partial<State> ;
}

export type action = 'incStep' | 'decStep' | 'setStep' | 'setName' | 'reset' | 'setSignDate' | 'setTotalAmount' | 'setPaymentList' | 'setNumberOfPayment' | 'finishSteps' | 'setMadadForSignDay' | 'setPredictMadad'

const reducer = (state: State, { action, data }: ReducerParams): State => {
  switch (action) {
    case 'incStep':
      localStorage.setItem('localState', JSON.stringify({ ...state, step: state.step +1 }))
      return { ...state, step: state.step +1 }
    case 'decStep':
      localStorage.setItem('localState', JSON.stringify({ ...state, step: state.step -1 }))
      return { ...state, step: state.step -1 }
    case 'setName':
      localStorage.setItem('localState', JSON.stringify({ ...state, name: data?.name || defaultState.name }))
      return { ...state, name: data?.name || defaultState.name }
    case 'setStep':
      localStorage.setItem('localState', JSON.stringify({ ...state, step: data?.step || defaultState.step }))
      return { ...state, step: data?.step || defaultState.step }
    case 'setSignDate':
      localStorage.setItem('localState', JSON.stringify({ ...state, signDate: data?.signDate || defaultState.signDate }))
      return { ...state, signDate: data?.signDate || defaultState.signDate }
    case 'setTotalAmount':
    localStorage.setItem('localState', JSON.stringify({ ...state, totalAmount: data?.totalAmount || defaultState.totalAmount }))
    return { ...state, totalAmount: data?.totalAmount || defaultState.totalAmount }
    case 'reset':
      localStorage.setItem('localState', JSON.stringify(defaultState))
      return defaultState
    case 'setNumberOfPayment':
      localStorage.setItem('localState', JSON.stringify({ ...state, numberOfPayment: data?.numberOfPayment || defaultState.numberOfPayment }))
      return { ...state, numberOfPayment: data?.numberOfPayment || defaultState.numberOfPayment }
    case 'setPaymentList':
      localStorage.setItem('localState', JSON.stringify({ ...state, paymentList: data?.paymentList || defaultState.paymentList }))
      return { ...state, paymentList: data?.paymentList || defaultState.paymentList }
    case 'finishSteps':
      localStorage.setItem('localState', JSON.stringify({ ...state, finishSteps: data?.finishSteps || defaultState.finishSteps }))
      return { ...state, finishSteps: data?.finishSteps || defaultState.finishSteps }
    case 'setMadadForSignDay':
      localStorage.setItem('localState', JSON.stringify({ ...state, madadForSignDay: data?.madadForSignDay || defaultState.madadForSignDay }))
      return { ...state, madadForSignDay: data?.madadForSignDay || defaultState.madadForSignDay }
    case 'setPredictMadad':
      localStorage.setItem('localState', JSON.stringify({ ...state, predictMadad: data?.predictMadad || defaultState.predictMadad }))
      return { ...state, predictMadad: data?.predictMadad || defaultState.predictMadad }
  }
}

export function createCtx<State, action>(
  reducer: React.Reducer<State, action>,
  initialState: State,
) {
  const defaultDispatch: React.Dispatch<action> = () => defaultState
  const ctx = React.createContext({
    state: initialState,
    dispatch: defaultDispatch, 
  })
  function Provider(props: React.PropsWithChildren<{}>) {
    const [state, dispatch] = React.useReducer<React.Reducer<State, action>>(reducer, initialState)
    return <ctx.Provider value={{ state, dispatch }} {...props} />
  }
  return [ctx, Provider] as const
}

const getInitialState = (): State => {
    const localState = localStorage.getItem('localState')
    if (!localState) {
      localStorage.setItem('localState', JSON.stringify(defaultState))
      return defaultState
    } else {
      return JSON.parse(localState)
    }
}

export const [ctx, StateContext] = createCtx(reducer, getInitialState())


function App() {
  return (
    <div className="App">
      <StateContext >
        <Header/>
        <Steps/>
        <Layout/>
      </StateContext>
    </div>
  );
}

export default App;
