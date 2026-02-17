import "./Chat.css";
import { MyContext } from "./MyContext.jsx";
import { useContext, useState, useEffect, use } from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/atom-one-dark.css";



export default function Chat() {
    const { newChat, previousChats, reply } = useContext(MyContext);
    const [latestReply, setLatestReply] = useState(null);


    useEffect(() => {
        if (reply === null) {
            setLatestReply(null); // Clear the latest reply when reply is null
            return; // Exit early if there is no reply to display
        }

        if (!previousChats?.length) return;

        const content = reply.split(" "); // Individual words in the reply

        let idx = 0; // Index of the last word in the reply

        const interval = setInterval(() => {
            setLatestReply(content.slice(0, idx + 1).join(" ")); // Update the latest reply with the current words

            idx++; // Move to the next word
            if (idx >= content.length) {
                clearInterval(interval); // Clear the interval when the entire reply has been displayed
            }
        }, 40);

        return () => clearInterval(interval); // Cleanup the interval on component unmount or when dependencies change  

    }, [previousChats, reply]);


    return (
        <>
            {newChat && <h1> Start a new Chat</h1>}
            <div className="chats">
                {
                    previousChats?.slice(0, -1).map((chat, index) =>
                        <div key={index} className={chat.role === "user" ? "userDiv" : "gptDiv"}>
                            {
                                chat.role === "user" ?
                                    (<p className="userMessage">{chat.content}</p>) :
                                    <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                        {chat.content}
                                    </ReactMarkdown>
                            }
                        </div>
                    )
                }

                {
                    previousChats.length > 0 && (
                        <>
                            {
                                latestReply === null ? (
                                    <div className="gptDiv" key={"non-typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                            {previousChats[previousChats.length - 1].content}
                                        </ReactMarkdown>
                                    </div>
                                ) : (
                                    <div className="gptDiv" key={"typing"}>
                                        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
                                            {latestReply}
                                        </ReactMarkdown>
                                    </div>
                                )
                            }
                        </>
                    )
                }


            </div>
        </>
    );
}
