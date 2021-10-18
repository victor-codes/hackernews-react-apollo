import React from "react";
import { useHistory } from "react-router";
import { useMutation, gql } from "@apollo/client";
import { useState } from "react";
import { AUTH_TOKEN } from "../constants";
import styled from "styled-components";
import { Button } from "@material-ui/core";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = () => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    login: true,
    email: "",
    password: "",
    name: "",
  });

  const [login] = useMutation(LOGIN_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
    },
    onCompleted: ({ login }) => {
      localStorage.setItem(AUTH_TOKEN, login.token);
      history.push("/");
    },
  });

  const [signup] = useMutation(SIGNUP_MUTATION, {
    variables: {
      email: formState.email,
      password: formState.password,
      name: formState.name,
    },
    onCompleted: ({ signup }) => {
      localStorage.setItem(AUTH_TOKEN, signup.token);
      history.push("/");
    },
  });

  return (
    <Wrapper>
      <Heading4 className="mv3">
        {formState.login ? "Login" : "Sign Up"}
      </Heading4>
      <InputWrapper>
        {!formState.login && (
          <Input
            value={formState.name}
            type="text"
            placeholder="Your name"
            onChange={(e) => {
              setFormState({ ...formState, name: e.target.value });
            }}
          />
        )}
        <Input
          value={formState.email}
          type="email"
          placeholder="Your email address"
          onChange={(e) => {
            setFormState({ ...formState, email: e.target.value });
          }}
        />
        <Input
          value={formState.password}
          type="password"
          placeholder="Choose a safe password"
          onChange={(e) => {
            setFormState({ ...formState, password: e.target.value });
          }}
        />
      </InputWrapper>
      <Flex className="flex">
        <Button
          color="primary"
          variant="contained"
          size="large"
          onClick={formState.login ? login : signup}
        >
          {formState.login ? "login" : "create account"}
        </Button>
        <Button
          classes={{ marginTop: "30px" }}
          variant="outlined"
          size="large"
          color="secondary"
          onClick={(e) =>
            setFormState({
              ...formState,
              login: !formState.login,
            })
          }
        >
          {formState.login
            ? "need to create an account"
            : "already have an accout"}
        </Button>
      </Flex>
    </Wrapper>
  );
};

const Heading4 = styled.h4`
  font-size: 1.875rem;
  font-weight: 400;
  text-align: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  margin: auto;

  .MuiButton-root {
    margin-bottom: 1rem;
  }
`;

const InputWrapper = styled.div`
  gap: 1rem;
  display: flex;
  flex-direction: column;
`;

const Flex = styled.div`
  display: flex;
  max-width: 400px;
  flex-direction: column;
  margin: 1.875rem 0 2.25rem;
`;

const Input = styled.input`
  padding: 1rem 0.75rem;
  font-size: 1rem;
  width: 100%
  border: 2px solid #000;
  border-radius: 8px;

  :focus {
    outline: none;
    border-color: #6ecd8a;
  }
`;

export default Login;
