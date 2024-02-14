import { useEffect, useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Loader from "./components/Loader";
import Error from "./components/Error";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./NextButton";
import Progress from "./components/Progress";
import FinishScreen from "./FinishScreen";

const initialState = {
  questions: [],
  //'loading','error','ready','active','finished'
  status: "loading",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
};
function reducer(initialState, action) {
  switch (action.type) {
    case "dataReceived":
      return { ...initialState, questions: action.payload, status: "ready" };
    case "dataFailed":
      return { ...initialState, status: "error" };
    case "start":
      return { ...initialState, status: "active" };
    case "newAnswer":
      const question = initialState.questions.at(initialState.index);
      return {
        ...initialState,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? initialState.points + question.points
            : initialState.points,
      };
    case "nextQuestion":
      return { ...initialState, index: initialState.index + 1, answer: null };
    case "finish":
      let highscore = 0;
      if (initialState.points > highscore) highscore = initialState.points;
      return { ...initialState, status: "finished", highscore };
    case "restart":
      return {
        ...initialState,
        index: 0,
        answer: null,
        points: 0,
        status: "ready",
      };
    default:
      throw new Error("Action inknown");
  }
}
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { questions, status, index, answer, points, highscore } = state;
  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, cur) => prev + cur.points,
    0
  );
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
        {status === "active" && (
          <>
            <Progress
              index={index}
              numQuestion={numQuestions}
              points={points}
              maxPossiblePoints={maxPossiblePoints}
            />
            <Question
              question={questions[index]}
              dispatch={dispatch}
              answer={answer}
            />
            <NextButton
              dispatch={dispatch}
              answer={answer}
              index={index}
              numQuestions={numQuestions}
            />
          </>
        )}
        {status === "finished" && (
          <FinishScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
}

export default App;
