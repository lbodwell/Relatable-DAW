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

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<HomePage user={user} authenticated={setUser}/>
				</Route>
				<Route exact path="/project/:id">
					<DAWLayout user={user} loggedOut={() => setUser(null)}/>
				</Route>
			</Switch>
		</BrowserRouter>
	);	
}

export default App;
