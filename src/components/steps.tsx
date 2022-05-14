import React ,{ useContext } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ctx } from '../App'
import './step.scss'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

const STEPS_TO_VALIDATE = [1,2,3]

function getSteps() {
  return ['פרטים אישיים','פרטים ראשונים', 'כמות תשלומים', 'הזנת סכומים'];
}

function getStepContent(step: number) {
  switch (step) {
    case 0:
      return 'פרטים אישיים';
    case 1:
      return 'פרטים ראשונים';
    case 2:
    return 'כמות תשלומים'
    case 3:
      return 'הזנת סכומים';
    default:
      return 'Unknown step';
  }
}

export default function HorizontalLinearStepper() {
  const classes = useStyles();
  const [skipped, setSkipped] = React.useState(new Set<number>());
  const steps = getSteps();
  const { state, dispatch } = useContext(ctx)

  const isStepOptional = (step: number) => {
    return step === 0;
  };

  const isStepSkipped = (step: number) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;
    if (isStepSkipped(state.step)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(state.step);
    }
    if (STEPS_TO_VALIDATE.includes(state.step)) {
      dispatch({action: 'finishSteps', data: {finishSteps: true}})
      return
    }
    dispatch({action: 'incStep'})
    setSkipped(newSkipped);
    
  };

  const handleBack = () => {
    dispatch({action: 'decStep'})
  };

  const handleSkip = () => {
    if (!isStepOptional(state.step)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    dispatch({action: 'incStep'})
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(state.step);
      return newSkipped;
    });
  };

  const handleReset = () => {
    dispatch({action: 'reset'})
  };

  const isStepActive = state.step !== 4 
  const steper = isStepActive ? <Stepper activeStep={state.step}>
  {steps.map((label, index) => {
    const stepProps: { completed?: boolean } = {};
    const labelProps: { optional?: React.ReactNode } = {};
    if (isStepOptional(index)) {
      labelProps.optional = <Typography variant="caption">לא חובה</Typography>;
    }
    if (isStepSkipped(index)) {
      stepProps.completed = false;
    }
    return (
      <Step key={label} {...stepProps}>
        <StepLabel {...labelProps}>{label}</StepLabel>
      </Step>
    );
  })}
</Stepper> : ''
  return (
    <div className={classes.root}>
      {steper}
      <div>
        {state.step === steps.length ? (
          <div className='topography'>
            <Button onClick={handleReset} className='from-start-button'>
              מהתחלה
            </Button>
            <Typography className={classes.instructions}>
              סיימת בהצלחה, להלן התוצאות:
            </Typography>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(state.step)}</Typography>
            <div>
              <Button disabled={state.step === 0} onClick={handleBack} className={classes.button}>
                חזור
              </Button>
              {isStepOptional(state.step) && (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSkip}
                  className={classes.button}
                >
                  דלג
                </Button>
              )}
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
              >
                {state.step === steps.length - 1 ? 'סיים' : 'הבא'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}