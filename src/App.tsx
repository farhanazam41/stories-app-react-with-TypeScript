import { useReducer, useEffect, useCallback, useState } from "react";
import "./styles.css";
import useSemiPersistStorage from "./useSemiPersistStorage";
import axios from "axios";
import InputWithLabel from "./InputWithLabel";
import List from "./List";
import Form from "./Form";

const API_ENDPOINT = "https://hn.algolia.com/api/v1/search?query=";
const initialStories = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];

const getAsyncStories = () =>
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve({ data: { stories: initialStories } });
    }, 2000);
  });

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Array<Story>;

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

interface StoriesFetchInitAction {
  type: "FETCH_STORIES_INIT";
}

interface StoriesFetchSuccessAction {
  type: "FETCH_STORIES_SUCCESS";
  payload: Stories;
}

interface StoriesFetchFailAction {
  type: "FETCH_STORIES_FAIL";
}

interface StorieRemoveAction {
  type: "REMOVE_STORY";
  payload: string;
}

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailAction
  | StorieRemoveAction;

const storiesReducer = (state: StoriesState, action: StoriesAction) => {
  switch (action.type) {
    case "FETCH_STORIES_INIT":
      return { ...state, isLoading: true, isError: false };
    case "FETCH_STORIES_SUCCESS":
      return { ...state, isLoading: false, data: action.payload };
    case "FETCH_STORIES_FAIL":
      return { ...state, isLoading: false, isError: true };
    case "REMOVE_STORY":
      return {
        ...state,
        data: state.data.filter((story) => story.objectID !== action.payload)
      };
    default:
      throw new Error();
  }
};

export default function App() {
  const [searchTerm, setSearchTerm] = useSemiPersistStorage("search", "React");
  const [stories, dispatchStories] = useReducer(storiesReducer, {
    data: [],
    isLoading: false,
    isError: false
  });
  const [url, setUrl] = useState(`${API_ENDPOINT}${searchTerm}`);

  const { isLoading, isError, data } = stories;
  const fetchStories = async () => {
    if (searchTerm === "") return;
    try {
      dispatchStories({ type: "FETCH_STORIES_INIT" });
      const { data } = await axios.get(url);
      dispatchStories({ type: "FETCH_STORIES_SUCCESS", payload: data.hits });
    } catch (err) {
      dispatchStories({ type: "FETCH_STORIES_FAIL" });
    }
  };

  const memoizedFetchStories = useCallback(() => fetchStories(), [url]);

  useEffect(() => {
    memoizedFetchStories();
  }, [memoizedFetchStories]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    // creates this function everytime parent components re-render, need to memoize with useCallback hook
    setSearchTerm(event.target.value);
  };

  const memoizedHandlerSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => handleSearch(event),
    []
  ); // memoize it becasue every time list changes and parent compoent creates a new reference of handlerSearch function

  const removeStory = (id: string) => {
    dispatchStories({ type: "REMOVE_STORY", payload: id });
  };

  const memoizedRemoveStroy = useCallback((id: string) => removeStory(id), []);
  // const fetchDataHandler = (event) => {
  //   event.preventDefault();
  //   setUrl(`${API_ENDPOINT}${searchTerm}`);
  // };

  const memoizedFetchHandler = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setUrl(`${API_ENDPOINT}${searchTerm}`);
    },
    [searchTerm]
  );
  return (
    <div className="App">
      <div>
        <Form onSubmit={memoizedFetchHandler}>
          <InputWithLabel
            label="Search"
            inputChange={memoizedHandlerSearch}
            type="search"
          />
        </Form>
      </div>
      {isLoading && <p>Loading!!</p>}
      {isError && <p>Error!</p>}
      {!isError && !isLoading && data && (
        <List items={data} removeStory={memoizedRemoveStroy} />
      )}
    </div>
  );
}
