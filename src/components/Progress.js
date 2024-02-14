function Progress({ index, numQuestion, points, maxPossiblePoints }) {
  return (
    <>
      <header className="progress">
        <progress id="file" value={index} max={numQuestion}></progress>

        <p>
          Question <strong>{index + 1}</strong> / {numQuestion}
        </p>
        <p>
          <strong>{points}</strong> / {maxPossiblePoints} points
        </p>
      </header>
    </>
  );
}

export default Progress;
