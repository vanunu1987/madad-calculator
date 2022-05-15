import React, {useEffect, useContext} from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import InnerLayout from './InnerLayout/InnerLayout';
import { ctx } from '../App'
import {getMadadForPaymentList, getPredictMadad} from '../services/madad'
import './layout.scss'


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      '& > *': {
        margin: theme.spacing(2),
        padding: theme.spacing(4),
       
      },
    },
  }),
);


export default function SimplePaper() {
  const { state, dispatch } = useContext(ctx)
  const classes = useStyles();
  useEffect(() => {
    (async function() {
        try {
            const predictMadad = await getPredictMadad()
            console.log({predictMadad});
            
            dispatch({ action: 'setPredictMadad', data: {predictMadad} })
            localStorage.setItem('localState', JSON.stringify({...state, predictMadad }))

          const updatePaymentList = await getMadadForPaymentList(state.paymentList, state.predictMadad)
          console.log({updatePaymentList});
          dispatch({ action: 'setPaymentList', data: {paymentList: updatePaymentList} })
          localStorage.setItem('localState', JSON.stringify({...state, paymentList: updatePaymentList }))
        } catch (e) {
            console.error(e);
        }
    })();
  }, []);
  const rootLayout = state.step === 4 ? ' root-layout' : ''
  return (
    <div className={classes.root + '' + rootLayout}>
      <Paper elevation={3}>
        <InnerLayout/>
      </Paper>
    </div>
  );
}