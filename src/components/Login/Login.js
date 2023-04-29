import React, { useState, useEffect, useReducer, useContext, useRef } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../context/auth-context';
import Input from '../UI/Input/Input';

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

  const emailRef = useRef();
  const pwRef = useRef();

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
    if (formIsValid) {
      authContext.onLogin(emailState.value, passwordState.value);
    } else if (!emailV) {
      emailRef.current.focus();
    } else {
      pwRef.current.focus();
    }
  };

  return (
    <Card className={classes.login}>
      <form onSubmit={submitHandler}>
        <Input
          ref={emailRef}
          valid={emailState.valid}
          value={emailState.value}
          type="email"
          id="email"
          onChange={emailChangeHandler}
          onBlur={validateEmailHandler}
          name="E-Mail"
        />
        <Input
          ref={pwRef}
          valid={passwordState.valid}
          value={passwordState.value}
          type="password"
          id="password"
          onChange={passwordChangeHandler}
          onBlur={validatePasswordHandler}
          name="Password"
        />
        <div className={classes.actions}>
          <Button type="submit" className={classes.btn}>
            Login
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default Login;
