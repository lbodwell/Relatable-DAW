import {useState} from "react";

import {
	BrowserRouter,
	Switch,
	Route,
	useHistory
} from "react-router-dom";

import HomePage from "./components/HomePage";
import AccountPage from "./components/AccountPage";
import DAWLayout from "./components/DAWLayout";
import Error404Page from "./components/Error404Page";

import "./styles/App.css";

const App = () => {
	const [user, setUser] = useState(null);

	const history = useHistory();

	const handleLogout = async () => {
		window.localStorage.removeItem("tokenId");
		setUser(null);
		history?.push("/");
	};

	return (
		<BrowserRouter>
			<Switch>
				<Route exact path="/">
					<HomePage user={user} loggedIn={setUser} loggedOut={handleLogout}/>
				</Route>
				<Route exact path="/project/:projectId">
					<DAWLayout user={user} loggedIn={setUser} loggedOut={handleLogout}/>
				</Route>
				<Route exact path="/guest">
					<DAWLayout user={null}/>
				</Route>
				<Route exact path="/account">
					<AccountPage user={user} loggedOut={handleLogout}/>
				</Route>
				<Route path="*">
					<Error404Page/>
				</Route>
			</Switch>
		</BrowserRouter>
	);	
}

export default App;