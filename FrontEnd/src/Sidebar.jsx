import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from 'uuid';


export default function Sidebar() {
    const { allThreads, setAllThreads, currthreadId, setNewChat, setPrompt, setReply, setCurrThreadId, setPreviousChats } = useContext(MyContext);

    const getAllThreads = async () => {

        try {
            const response = await fetch("https://gpt-backend-rbqk.onrender.com/api/thread");
            const res = await response.json();
            const filteredRes = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            // console.log(filteredRes);
            setAllThreads(filteredRes);
            // Thread id  , title
        } catch (error) {
            console.log("Error fetching threads:", error);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, []);


    const createNewChat = async () => {
        const newId = uuidv4();
        setNewChat(true); // Set newChat to true to trigger new chat thread creation in ChatWindow
        setPrompt(""); // Clear the prompt state to reset the input field in ChatWindow
        setReply(null); // Clear the reply state to reset the chat window in ChatWindow
        setCurrThreadId(newId); // Generate a new unique thread ID for the new chat thread
        setPreviousChats([]); // Clear previous chats to reset the chat history for the new thread
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);

        try {
            const response = await fetch(`https://gpt-backend-rbqk.onrender.com/api/thread/${newThreadId}`);
            const res = await response.json();
            console.log(res); // Update previousChats with the chats of the selected thread
            setPreviousChats(res);
            setNewChat(false); // Set newChat to false to indicate that we are switching to an existing thread
            setReply(null); // Clear the reply state to reset the chat window for the selected thread
        }

        catch (error) {
            console.log("Error fetching chats for the selected thread:", error);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            console.log(res);

            //updated thread re-rendering after deletion
            setAllThreads(prevThreads => prevThreads.filter(thread => thread.threadId !== threadId));

            // If the deleted thread is the current thread, reset the chat window
            if (threadId === currthreadId) {
                createNewChat();

            }
        } catch (error) {
            console.log("Error deleting thread:", error);
        }
    };

    return (
        <section className="sidebar">
            {/* New Chat Button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="GPT Logo" className="logo"></img>
                <span> <i className="fa-regular fa-pen-to-square"></i> </span>
            </button>

            {/* History */}

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={(e) => changeThread(thread.threadId)}
                            className={thread.threadId === currthreadId ? "highlighted" : ""}
                        >
                            {thread.title}
                            <i className="fa-regular fa-trash-can" onClick={(e) => {
                                e.stopPropagation(); // Stop the event bubbling
                                deleteThread(thread.threadId);
                            }}></i>
                        </li>
                    ))
                }
            </ul>


            {/* Sign */}
            <div className="sign">
                <p className="moving-text">By Amol  Ramraj Sharma &hearts;</p>
            </div>
        </section>
    );
}

