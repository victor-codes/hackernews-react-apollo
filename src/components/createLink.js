import React, { useState } from "react";
import { useMutation, gql } from "@apollo/client";
import { useHistory } from "react-router";
import { Button } from "@material-ui/core";
import styled from "styled-components";
import { FEED_QUERY } from "./LinkList.";
import { LINK_PER_PAGE } from "../constants";

const CREATE_LINK_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;

const CreateLink = () => {
  const history = useHistory();
  const [formState, setFormState] = useState({
    description: "",
    url: "",
  });

  const [createLink] = useMutation(CREATE_LINK_MUTATION, {
    variables: {
      description: formState.description,
      url: formState.url,
    },
    update(cache, { data: { post } }) {
      const take = LINK_PER_PAGE;
      const skip = 0;
      const orderBy = { createdAt: "desc" };

      const data = cache.readQuery({
        query: FEED_QUERY,
        variables: {
          take,
          skip,
          orderBy,
        },
      });
      cache.writeQuery({
        query: FEED_QUERY,
        data: {
          feed: {
            links: [post, ...data.feed.links],
          },
        },
        variables: {
          take,
          skip,
          orderBy,
        },
      });
    },
    onCompleted: () => history.push("/"),
  });

  return (
    <div>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          createLink();
        }}
      >
        <InputWrapper className="flex flex-column mt3">
          <Input
            className="mb2"
            value={formState.description}
            onChange={(e) =>
              setFormState({
                ...formState,
                description: e.target.value,
              })
            }
            type="text"
            placeholder="A description for the link"
          />
          <Input
            className="mb2"
            value={formState.url}
            onChange={(e) =>
              setFormState({
                ...formState,
                url: e.target.value,
              })
            }
            type="url"
            placeholder="The URL for the link"
          />
        </InputWrapper>
        <Button variant="contained" color="primary" size="large" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

const InputWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 1rem 0.75rem;
  font-size: 1rem;
  width: 100%;
  border: 2px solid #eee;
  border-radius: 8px;

  :focus {
    outline: none;
    border-color: #6ecd8a;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.875rem;
  max-width: 400px;
  margin: auto;
`;

export default CreateLink;

// import { useMutation, gql } from "@apollo/client";
// import React, { useState } from "react";

// const CreateLink = () => {
//   const CREATE_LINK_MUTATION = gql`
//     mutation PostMutation($description: String!, $url: String!) {
//       post(description: $description, url: $url) {
//         id
//         createdAt
//         description
//         url
//       }
//     }
//   `;
//   const [formState, setFormState] = useState({
//     description: "",
//     url: "",
//   });

//   const [createLink] = useMutation(CREATE_LINK_MUTATION, {
//     variables: {
//       description: formState.description,
//       url: formState.url,
//     },
//   });

//   return (
//     <div>
//       <form
//         className="flex flex-column mt3"
//         action=""
//         onSubmit={(e) => {
//           e.preventDefault();
//           createLink();
//         }}
//       >
//         <input
//           className="mb2"
//           onChange={(e) => {
//             setFormState({ ...formState, description: e.target.value });
//           }}
//           value={formState.description}
//           type="text"
//           placeholder="A description for the link"
//         />
//         <input
//           className="mb2"
//           onChange={(e) => {
//             setFormState({ ...formState, url: e.target.value });
//           }}
//           value={formState.url}
//           type="text"
//           placeholder="A URL for the link"
//         />
//         <button type="submit">Submit</button>
//       </form>
//     </div>
//   );
// };

// export default CreateLink;
