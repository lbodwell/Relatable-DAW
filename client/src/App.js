import {useState} from "react";

import {
	BrowserRouter,
	Switch,
	Route
} from "react-router-dom";

import HomePage from "./components/HomePage";
import DAWLayout from "./components/DAWLayout";

import "./styles/App.css";

const App = () => {
	const [user, setUser] = useState(null);

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<HomePage user={user} loggedIn={setUser} loggedOut={() => setUser(null)}/>
				</Route>
				<Route exact path="/project/:projectId">
					<DAWLayout user={user} loggedIn={setUser} loggedOut={() => setUser(null)}/>
				</Route>
				<Route exact path="/guest">
					<DAWLayout user={null}/>
				</Route>
				<Route path="*">
					<div className="center-text">
						<h1>Error 404</h1>
						<h3>The page you are looking for does not exist</h3>
					</div>
				</Route>
			</Switch>
		</BrowserRouter>
	);	
}

export default App;
