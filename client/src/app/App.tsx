import { useEffect, useState } from "react";
import { getHealthStatus } from "../services/systemService";
import './App.css';

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getHealthStatus();
      setMessage(data.message);
    };

    fetchData();
  }, []);

  return (
    <div>
      <h1>Tax System</h1>
      <p>Backend says: {message}</p>
    </div>
  );
}

export default App;