import { useMutation, gql } from "@apollo/client";
import React from "react";
import { Link as LinkTo } from "react-router-dom";
import styled from "styled-components";
import { AUTH_TOKEN } from "../constants";
import { timeDifferenceForDate } from "../utils";
import { FEED_QUERY } from "./LinkList.";

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const Link = ({
  link: { id, url, description, votes, postedBy, createdAt },
  index,
}) => {
  const [vote] = useMutation(VOTE_MUTATION, {
    variables: {
      linkId: id,
    },
    update(cache, { data: { vote } }) {
      const { feed } = cache.readQuery({
        query: FEED_QUERY,
      });
      const updatedLinks = feed.links.map((feedLink) => {
        if (feedLink.id === id) {
          return {
            ...feedLink,
            votes: [...feedLink.votes, vote],
          };
        }
        return feedLink;
      });
      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            link: updatedLinks,
          },
        },
      });
    },
  });

  const authToken = localStorage.getItem(AUTH_TOKEN);
  // const take = LINKS_PER_PAGE;
  // const orderBy = { createdAt: "desc" };
  return (
    <Wrapper>
      <div className="container">
        <div className="contents">
          <span className="number gray">{index + 1}.</span>
          {authToken && (
            <div className="vote" style={{ cursor: "pointer" }} onClick={vote}>
              ▲
            </div>
          )}
        </div>
        <div className="ml1">
          <div className="title">
            {description}{" "}
            <LinkTo to={url} className="url">
              {url}
            </LinkTo>
          </div>
          {authToken && (
            <div className="votes f6 lh-copy gray">
              {votes.length} votes | by | {postedBy ? postedBy.name : "Unknown"}{" "}
              | {timeDifferenceForDate(createdAt)}
            </div>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

const Wrapper = styled.li`
  display: flex;
  padding: 0 0 1rem 0;

  .container {
    display: flex;
    align-items: center;
  }

  .number {
    margin-right: 1rem;
  }

  .contents {
    display: contents !important;
  }

  .title {
    font-size: 1.125rem;
  }

  .url {
    font-size: 0.875rem;
    color: #aaa;
    text-decoration: none;
  }

  .vote {
    padding-right: 0.5rem;
    color: #999;
  }

  .votes {
    font-size: 0.875rem;
  }
`;

export default Link;
