import {useHistory} from "react-router-dom";

import {Button, Typography} from "@material-ui/core";

import HomeIcon from "@material-ui/icons/Home";

import MenuBar from "./MenuBar";

const Error404Page = () => {
	const history = useHistory();

	const handleReturnHome = () => {
		history.push("/");
	};

	return (
		<>
			<MenuBar/>
			<div className="center-text">
				<Typography variant="h3" style={{fontWeight: "bold"}}>Error 404</Typography>
				<Typography variant="h5" style={{marginTop: "1rem"}}>
					The page you're looking for either doesn't exist or you don't have permission to view it!
				</Typography>
				<Button
					variant="contained"
					color="primary"
					startIcon={<HomeIcon/>}
					style={{marginTop: "2rem"}}
					onClick={handleReturnHome}>
					Back to Home
				</Button>
			</div>
		</>
	);
};

export default Error404Page;