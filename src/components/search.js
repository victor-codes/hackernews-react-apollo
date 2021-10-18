import { Button } from "@material-ui/core";
import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { Link } from "react-router-dom";

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      id
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`;

const Search = () => {
  const [executeSearch, { data }] = useLazyQuery(FEED_SEARCH_QUERY);
  const [searchFilter, setSearchFilter] = useState("");
  return (
    <>
      <div>
        Search
        <input
          type="text"
          placeholder="Search for posts"
          onChange={(e) => setSearchFilter(e.target.value)}
        />
        <Button
          onClick={() =>
            executeSearch({
              variables: { filter: searchFilter },
            })
          }
        >
          OK
        </Button>
      </div>
      {data &&
        data.feed.links.map((link, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
    </>
  );
};

export default Search;
