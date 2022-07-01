
import { Route, Routes } from "react-router-dom";
import Chatpage from "./pages/chatpage/Chatpage";
import Homepage from "./pages/homepage/Homepage";
function App() {
  return (
    <div className="App">  
    <Routes>
    <Route exact path="/" element={<Homepage/>}></Route>
    <Route  path="/chats" element={<Chatpage/>}></Route>
    </Routes>

    </div>
  );
}

export default App;
