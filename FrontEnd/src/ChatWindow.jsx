import "./ChatWindow.css";
import Chat from "./Chat.jsx";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect } from "react";
import { PacmanLoader } from 'react-spinners';

export default function ChatWindow() {
    const { prompt, setPrompt, reply, setReply, currthreadId, setCurrThreadId, previousChats, setPreviousChats, setNewChat, setIsSidebarOpen } = useContext(MyContext);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const getReply = async () => {
        setLoading(true);
        setNewChat(false);

        const options = {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: prompt,
                threadId: currthreadId
            })
        };

        try {
            const response = await fetch("https://gpt-backend-rbqk.onrender.com/api/chat", options);
            const res = await response.json();
            setReply(res.reply);
        } catch (error) {
            console.log("Error fetching reply:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (reply && prompt) {
            setPreviousChats(prevChats => [
                ...prevChats,
                { role: "user", content: prompt },
                { role: "gpt", content: reply }
            ]);
            setPrompt("");
        }
    }, [reply]);

    const handleProfileClicks = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="chatWindow">
            <div className="navbar">
                <i className="fa-solid fa-bars hamburger" onClick={() => setIsSidebarOpen(true)}></i>
                <span>SigmaGpt <i className="fa-solid fa-chevron-down"></i></span>
                <div className="userIcon" onClick={handleProfileClicks}>
                    <span className="user"><i className="fa-regular fa-user"></i></span>
                </div>

            </div>
            {
                isOpen &&
                <div className="dropDown">
                    <div className="dropDownItems"><i class="fa-solid fa-gear"></i>Setting </div>
                    <div className="dropDownItems"><i class="fa-solid fa-cloud-arrow-up"></i>Upgrade Plan </div>
                    <div className="dropDownItems"><i class="fa-solid fa-arrow-right-from-bracket"></i>Log Out </div>
                </div>
            }

            <Chat />

            <PacmanLoader className="loader" color="#fff" loading={loading} />

            {/* Input Section - Class name updated to match your CSS */}
            <div className="chatInput">
                <div className="inputBox">
                    <input
                        type="text"
                        placeholder="Ask Anything"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' ? getReply() : ''}
                    />
                    <div id="submit" onClick={getReply}>
                        <i className="fa-regular fa-paper-plane"></i>
                    </div>
                </div>
                <p className="info">
                    SigmaGPT can make mistakes. Check important info.
                </p>
            </div>
        </div>
    );
}