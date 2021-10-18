import { useQuery, gql } from "@apollo/client";
import Link from "./Link";
import { useHistory } from "react-router-dom";
import { LINK_PER_PAGE } from "../constants.js";
import {Button} from "@material-ui/core";
export const FEED_QUERY = gql`
  query FeedQuery($take: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(take: $take, skip: $skip, orderBy: $orderBy) {
      id
      links {
        id
        url
        description
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
        createdAt
      }
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
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
      createdAt
    }
  }
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
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
        createdAt
      }
      user {
        id
      }
    }
  }
`;

const getLinksToRender = (isNewPage, data) => {
  if (isNewPage) {
    return data.feed.links;
  }

  const rankedLinks = data.feed.links.slice();
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
  return rankedLinks;
};

const getQueryVariable = (isNewPage, page) => {
  const skip = isNewPage ? (page - 1) * LINK_PER_PAGE : 0;
  const take = isNewPage ? LINK_PER_PAGE : 100;
  const orderBy = { createdAt: "desc" };
  return { take, skip, orderBy };
};

const LinkList = () => {
  const history = useHistory();

  const isNewPage = history.location.pathname.includes("new");

  const pageIndexParams = history.location.pathname.split("/");

  const page = parseInt(pageIndexParams[pageIndexParams.length - 1]);

  const pageIndex = page ? page - 1 * LINK_PER_PAGE : 0;

  const { data, loading, error, subscribeToMore } = useQuery(FEED_QUERY, {
    variables: getQueryVariable(isNewPage, page),
  });

  // subscribe to new votes

  // subscribe to new links
  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;
      const exists = prev.feed.links.find(({ id }) => id === newLink.id);

      if (exists) return prev;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename,
        },
      });
    },
  });

  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION,
  });

  return (
    <>
      {loading && <p>Loading...</p>}
      {error && <pre>{JSON.stringify(error, null, 2)}</pre>}
      {data && (
        <>
          {getLinksToRender(isNewPage, data).map((link, index) => (
            <Link key={link.id} link={link} index={index} />
          ))}
          {isNewPage && (
            <div>
              <Button
                onClick={() => {
                  if (page > 1) {
                    history.push(`/new/${page - 1}`);
                    
                  }
                }}
              >
                Previous
              </Button>
              <Button
                onClick={() => {
                  if (page <= data.feed.count / LINK_PER_PAGE) {
                    const nextPage = page + 1;
                    history.push(`/new/${nextPage}`);
                  }
                }}
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default LinkList;
