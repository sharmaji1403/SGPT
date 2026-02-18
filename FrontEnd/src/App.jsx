import "./App.css";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow.jsx";
import { MyContext } from "./MyContext";
import { useState } from "react";
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [prompt , setPrompt] = useState("");
  const [reply , setReply] = useState(null);
  const [currthreadId, setCurrThreadId] = useState(uuidv4());  
  const [previousChats, setPreviousChats] = useState([]); 
  const [newChat , setNewChat] = useState(true); 
  const [allThreads , setAllThreads] = useState([]); 


  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const providerValue = {
    prompt, setPrompt, 
    reply, setReply, 
    currthreadId, setCurrThreadId,
    previousChats, setPreviousChats,
    newChat, setNewChat , 
    allThreads, setAllThreads,
    isSidebarOpen, setIsSidebarOpen 
  };

  return (
    <div className="app">
      <MyContext.Provider value={providerValue}>
        <Sidebar />
        <ChatWindow />
      </MyContext.Provider>
    </div>
  )
}

export default App;