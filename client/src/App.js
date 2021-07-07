import {useEffect, useState} from "react";

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

	useEffect(() => {
		console.log(user);
	}, [user]);

	const logOut = () => setUser(null);

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<HomePage user={user} loggedIn={setUser} loggedOut={logOut}/>
				</Route>
				<Route exact path="/project/:projectId">
					<DAWLayout user={user} loggedOut={logOut}/>
				</Route>
				<Route exact path="/guest">
					<DAWLayout user={null}/>
				</Route>
			</Switch>
		</BrowserRouter>
	);	
}

export default App;
