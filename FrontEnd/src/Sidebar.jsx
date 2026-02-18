import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from "./MyContext";
import { v4 as uuidv4 } from 'uuid';

export default function Sidebar() {

    const {
        allThreads, setAllThreads, currthreadId, setNewChat,
        setPrompt, setReply, setCurrThreadId, setPreviousChats,
        isSidebarOpen, setIsSidebarOpen 
    } = useContext(MyContext);

    const getAllThreads = async () => {
        try {
            const response = await fetch("https://gpt-backend-rbqk.onrender.com/api/thread");
            const res = await response.json();
            const filteredRes = res.map(thread => ({ threadId: thread.threadId, title: thread.title }));
            setAllThreads(filteredRes);
        } catch (error) {
            console.log("Error fetching threads:", error);
        }
    };

    useEffect(() => {
        getAllThreads();
    }, []);

    const createNewChat = async () => {
        const newId = uuidv4();
        setNewChat(true);
        setPrompt("");
        setReply(null);
        setCurrThreadId(newId);
        setPreviousChats([]);
        if (window.innerWidth <= 768) setIsSidebarOpen(false);
    };

    const changeThread = async (newThreadId) => {
        setCurrThreadId(newThreadId);
        try {
            const response = await fetch(`https://gpt-backend-rbqk.onrender.com/api/thread/${newThreadId}`);
            const res = await response.json();
            setPreviousChats(res);
            setNewChat(false);
            setReply(null);
            if (window.innerWidth <= 768) setIsSidebarOpen(false);
        } catch (error) {
            console.log("Error fetching chats:", error);
        }
    };

    const deleteThread = async (threadId) => {
        try {
            const response = await fetch(`https://gpt-backend-rbqk.onrender.com/api/thread/${threadId}`, { method: "DELETE" });
            const res = await response.json();
            setAllThreads(prevThreads => prevThreads.filter(thread => thread.threadId !== threadId));
            if (threadId === currthreadId) {
                createNewChat();
            }
        } catch (error) {
            console.log("Error deleting thread:", error);
        }
    };

    return (
    
        <section className={`sidebar ${isSidebarOpen ? "active" : ""}`}>

           
            <div className="mobile-sidebar-header" style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
                <i className="fa-solid fa-xmark close-icon"
                    style={{ fontSize: '24px', cursor: 'pointer', color: 'white' }}
                    onClick={() => setIsSidebarOpen(false)}></i>
            </div>

            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="GPT Logo" className="logo"></img>
                <span> <i className="fa-regular fa-pen-to-square"></i> </span>
            </button>

            <ul className="history">
                {
                    allThreads?.map((thread, idx) => (
                        <li key={idx}
                            onClick={() => changeThread(thread.threadId)}
                            className={thread.threadId === currthreadId ? "highlighted" : ""}
                        >
                            {thread.title}
                            <i className="fa-regular fa-trash-can" onClick={(e) => {
                                e.stopPropagation();
                                deleteThread(thread.threadId);
                            }}></i>
                        </li>
                    ))
                }
            </ul>

            <div className="sign">
                <p className="moving-text">By Amol Ramraj Sharma &hearts;</p>
            </div>
        </section>
    );
}