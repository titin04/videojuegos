import GameList from "./components/Gamelist";

function App() {
  return (
    <div className="app-container fade-in">
      <header className="app-header">
        <h1>Vortex Games</h1>
        <p className="subtitle">Explora los mejores mundos virtuales</p>
      </header>
      <main className="content-area">
        <GameList />
      </main>
    </div>
  );
}

export default App;
