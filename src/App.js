import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
const initialState = {
  questions: [],
  //'loading','error','ready','active','finished'
  status: "loading",
  index: 0,
};
function reducer(initialState, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...initialState, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...initialState, status: "error" };
    case "start":
      return { ...initialState, status: "active" };
    default:
      throw new Error("Action inknown");
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index } = state;
  const numQuestions = questions.length;
  useEffect(function () {
    fetch("http://localhost:8000/questions")
      .then((res) => res.json())
      .then((data) => dispatch({ type: "dataReceived", payload: data }))
      .catch((err) => dispatch({ type: "dataFailed" }));
  }, []);

  return (
    <div className="app">
      <div className="app-header">
        <Header />
      </div>
      <Main>
        {status === "loading" && <Loader />}
        {status === "error" && <Error />}
        {status === "ready" && (
          <StartScreen numQuestions={numQuestions} dispatch={dispatch} />
        )}
        {status === "active" && <Question question={questions[index]} />}
      </Main>
    </div>
  );
}

export default App;
