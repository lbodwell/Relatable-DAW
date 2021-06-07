import Sequencer from "./components/Sequencer";
import KeyManager from "./components/KeyManager";
import "./App.css";

const App = () => {
	return (
		<div className="App">
			<h1>Relatable DAW</h1>
			<KeyManager/>
			<Sequencer/>
		</div>
	);
}

export default App;
