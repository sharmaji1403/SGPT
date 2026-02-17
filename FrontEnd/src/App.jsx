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
  const [previousChats, setPreviousChats] = useState([]); // Store all threads and their chats in this state variable
  const [newChat , setNewChat] = useState(true); // State variable to trigger new chat thread creation 
  const [allThreads , setAllThreads] = useState([]); // State variable to store all threads with their respective chats. This will be used to display threads in the sidebar and manage them effectively. Each thread will have a unique threadId, a title (which can be the first user message), and an array of chats (messages) in that thread.

const providerValue = {
  prompt, setPrompt, 
  reply, setReply, 
  currthreadId, setCurrThreadId,
  previousChats, setPreviousChats,
  newChat, setNewChat , 
  allThreads, setAllThreads
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

export default App
