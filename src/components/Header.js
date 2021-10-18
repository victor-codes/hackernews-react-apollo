import React from "react";
import { Link, useHistory } from "react-router-dom";
import { AUTH_TOKEN } from "../constants";
import { Button } from "@material-ui/core";
import styled from "styled-components";

const Header = () => {
  const history = useHistory();
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <Wrapper className="orange">
      <div className="flex">
        <Heading1>Hacker News</Heading1>
        <Link to="/" className="ml1 no-underline black">
          New
        </Link>
        <div className="divider">|</div>
        <Link to="/top" className="ml1 no-underline black">
          Top
        </Link>
        <div className="divider">|</div>
        <Link to="/search" className="ml1 no-underline black">
          Search
        </Link>
        {authToken && (
          <div className="flex">
            <div className="divider">|</div>
            <Link to="/create" className="ml1 no-underline black">
              Submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <Button
            style={{ cursor: "pointer" }}
            onClick={() => {
              localStorage.removeItem(AUTH_TOKEN);
              history.push("/");
            }}
          >
            logout
          </Button>
        ) : (
          <Link
            to="/login"
            style={{ cursor: "pointer" }}
            // onClick={() => {
            //   history.push("/login");
            // }}
          >
            login
          </Link>
        )}
      </div>
    </Wrapper>
  );
};

const Heading1 = styled.h1`
  font-size: 1rem;
  font-weight: 600;
  margin-right: 1rem;
  color: #000 !important;
`;

const Wrapper = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;

  .flex {
    display: flex;
    align-items: center;
  }

  .divider {
    color: #000;
  }
  a {
    margin: 0 8px;
  }
`;

export default Header;
