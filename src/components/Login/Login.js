import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../context/auth-context';

const variableReducer = (state, action) => {
  if (action.type === 'USER_INPUT') {
    return {valid: action.cond(action.val), value: action.val}
  }
  if (action.type === 'INPUT_BLUR') {
    return {valid: action.cond(state.value), value: state.value}
  }
}

const Login = (props) => {
  const authContext = useContext(AuthContext);

  const [formIsValid, setFormIsValid] = useState(false);

  const [emailState, dispatchEmail] = useReducer(variableReducer, {valid: undefined, value: ''});
  const [passwordState, dispatchPassword] = useReducer(variableReducer, {valid: undefined, value: ''});

  const {valid: emailV} = emailState;
  const {valid: passwV} = passwordState;

  useEffect(() => {
    const identifier = setTimeout(() => {
      setFormIsValid(
        emailV && passwV
      );
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [emailV, passwV]);

  const emailChangeHandler = (event) => {
    dispatchEmail({type: 'USER_INPUT', val: event.target.value, cond: (a) => a.includes('@')});
  };

  const passwordChangeHandler = (event) => {
    dispatchPassword({type: 'USER_INPUT', val: event.target.value, cond: (a) => a.trim().length > 6});
  };

  const validateEmailHandler = () => {
    dispatchEmail({type: 'INPUT_BLUR', cond: (a) => a.includes('@')});
  };

  const validatePasswordHandler = () => {
    dispatchPassword({type: 'INPUT_BLUR', cond: (a) => a.trim().length > 6});
  };

  const submitHandler = (event) => {
    event.preventDefault();
    authContext.onLogin(emailState.value, passwordState.value);
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <div
          className={`${classes.control} ${
            emailState.valid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="email">E-Mail</label>
          <input
            type="email"
            id="email"
            value={emailState.value}
            onChange={emailChangeHandler}
            onBlur={validateEmailHandler}
          />
        </div>
        <div
          className={`${classes.control} ${
            passwordState.valid === false ? classes.invalid : ''
          }`}
        >
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={passwordState.value}
            onChange={passwordChangeHandler}
            onBlur={validatePasswordHandler}
          />
        </div>
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn} disabled={!formIsValid}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
