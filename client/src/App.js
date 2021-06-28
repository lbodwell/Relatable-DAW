import {
	BrowserRouter,
	Switch,
	Route
} from "react-router-dom";

import HomePage from "./components/HomePage";
import DAWLayout from "./components/DAWLayout";

import "./styles/App.css";

const App = () => {
	return (
		<BrowserRouter>
			<Switch>/
				<Route exact path="/" component={HomePage}/>
				<Route exact path="/project/:id" component={DAWLayout}/>
			</Switch>
		</BrowserRouter>
	);	
}

export default App;
