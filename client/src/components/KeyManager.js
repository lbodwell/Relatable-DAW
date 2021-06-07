import {useState} from "react";

const KeyManager = () => {
	const [key, setKey] = useState("C Major");

	return (
		<h1>{`Key: ${key}`}</h1>
	);
};

export default KeyManager;