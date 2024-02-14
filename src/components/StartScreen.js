function StartScreen({ numQuestions, dispatch }) {
  function startHandler() {
    dispatch({ type: "start" });
  }
  return (
    <div className="start">
      <h2>Welcome to the react Quizz!</h2>
      <h3>{numQuestions} questions to test your React mastery</h3>
      <button className="btn btn-ui" onClick={startHandler}>
        Let's start
      </button>
    </div>
  );
}

export default StartScreen;
