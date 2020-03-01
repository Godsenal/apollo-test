import React, { useState, useEffect } from "react";
import { gql, NetworkStatus } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import {
  TextInput,
  Grid,
  Box,
  Heading,
  Paragraph,
  Text,
  Anchor
} from "grommet";
import debounce from "lodash.debounce";
import { Repository, PageInfo } from "./model";
import useIO from "./hooks/useIO";

// const GET_DEVICE = gql`
//   query getDevice {
//     device @client {
//       vendor
//       model
//       type
//     }
//   }
// `;

const SEARCH_REPO = gql`
  query searchRepo($query: String!, $after: String) {
    search(query: $query, type: REPOSITORY, first: 20, after: $after) {
      edges {
        node {
          ... on Repository {
            id
            name
            description
            url
            isChinese @client
          }
        }
      }
      pageInfo {
        startCursor
        endCursor
        hasNextPage
      }
    }
  }
`;

function App() {
  // const { data } = useQuery<{ device: Device }>(GET_DEVICE);
  const [input, setInput] = useState("");
  const [query, setQuery] = useState(input);
  const [updateQuery] = useState(() => debounce(setQuery, 500));
  const [observerRef, setObserverRef] = useState<HTMLDivElement | null>(null);
  const { data, fetchMore, networkStatus } = useQuery<{
    search: {
      edges: { node: Repository }[];
      pageInfo: PageInfo;
    };
  }>(SEARCH_REPO, {
    notifyOnNetworkStatusChange: true,
    variables: { query },
    skip: !query
  });

  const repoList = data?.search.edges || [];
  const hasNextPage = data?.search.pageInfo.hasNextPage;
  const nextCursor = data?.search.pageInfo.endCursor;
  const isInitialLoading = [
    NetworkStatus.loading,
    NetworkStatus.setVariables
  ].includes(networkStatus);
  const isFetchMore = networkStatus === NetworkStatus.fetchMore;

  useEffect(() => {
    updateQuery(input);
  }, [input, updateQuery]);

  const fetchMoreRepo = () => {
    if (!hasNextPage || isFetchMore) {
      return;
    }
    fetchMore({
      variables: {
        query: input,
        after: nextCursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          search: {
            ...prev.search,
            edges: [...prev.search.edges, ...fetchMoreResult.search.edges],
            pageInfo: {
              ...prev.search.pageInfo,
              ...fetchMoreResult.search.pageInfo
            }
          }
        };
      }
    });
  };

  useIO(observerRef, fetchMoreRepo);

  return (
    <Grid>
      <Box width="large" pad="large" margin="auto">
        {/* {Object.entries(data?.device || {}).map(([key, value]) => (
        <span key={key}>
          {key}: {value}
          <br />
        </span>
      ))} */}
        <TextInput
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Repo 이름 검색"
        />

        {isInitialLoading ? (
          <Heading textAlign="center">로딩중...</Heading>
        ) : (
          <>
            {repoList.length === 0 ? (
              <Heading level={2} textAlign="center">
                검색 결과가 <br /> 존재하지 않습니다.
              </Heading>
            ) : (
              <>
                {repoList.map(({ node }, i) => (
                  <Box key={i}>
                    <Heading level={3} alignSelf="start">
                      <Anchor
                        href={node.url}
                        color={node.isChinese ? "red" : "brand"}
                        target="_blank"
                      >
                        {node.name}
                      </Anchor>
                    </Heading>
                    <Paragraph>{node.description}</Paragraph>
                  </Box>
                ))}
                <Box ref={setObserverRef} pad="medium">
                  <Text textAlign="center">
                    {isFetchMore ? "로드중..." : ""}
                  </Text>
                </Box>
              </>
            )}
          </>
        )}
      </Box>
    </Grid>
  );
}

export default App;
