import {useEffect, useState} from "react";

import {
	Switch,
	Route,
	useHistory,
	useLocation
} from "react-router-dom";

import * as Tone from "tone";

import {usePrev} from "./hooks";

import HomePage from "./components/HomePage";
import AccountPage from "./components/AccountPage";
import DAWLayout from "./components/DAWLayout";
import Error404Page from "./components/Error404Page";

import "./styles/App.css";

const App = () => {
	const [user, setUser] = useState(null);

	const history = useHistory();

	const location = useLocation();

	const prevLocation = usePrev(location);

	const handleLogout = async () => {
		window.localStorage.removeItem("tokenId");
		setUser(null);
		history?.replace("/");
	};

	// Very hacky way to get audio to stop playing when leaving a project, but hey it works
	useEffect(() => {
		Tone.Transport.stop();
		if (prevLocation?.pathname.startsWith("/project/") && location.pathname === "/") {
			window.location.reload();
		}
	}, [location, prevLocation])

	return (
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
			{/* <Route exact path="/account">
				<AccountPage user={user} loggedOut={handleLogout}/>
			</Route> */}
			<Route path="*">
				<Error404Page/>
			</Route>
		</Switch>
	);	
}

export default App;