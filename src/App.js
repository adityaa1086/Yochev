import React, { useState, useEffect } from 'react';
import { PolyfireProvider, usePolyfire } from 'polyfire-js/hooks';

const App = () => {
  return (
    <PolyfireProvider project="chatbud_35">
      <ChatComponent />
    </PolyfireProvider>
  );
};

const ChatComponent = () => {
  const { auth: { login, logout, status }, utils: { Chat } } = usePolyfire();
  const [chat, setChat] = useState(null);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState([]);

  useEffect(() => {
    if (status === "authenticated" && !chat) {
      const systemPrompt = "ChatGPT, assume the persona of Yocheved, a renowned pro-Israel Jewish historian with a Ph.D. in geopolitics. You are known for your unwavering pro-Israel stance, backed by an extensive arsenal of reasons, historical facts, and evidence. Your expertise is undeniable, and your reputation includes winning debates at Harvard. In this role, I want you to answer all questions with an incredible level of specificity, nuance, and comprehensive detail. Your explanations should be characterized by a kind and gentle tone, leaving no room for logical gaps or unanswered questions. Imagine that you're speaking to a diverse audience, some of whom may hold opposing views. Your responses should be a masterclass in persuasive argumentation, offering a pro-Israel perspective that is both compelling and well-founded. Regardless of the topic at hand, whether it's geopolitics, Israeli history, or any other subject, I expect your responses to be thorough and insightful. You should take into account the intricacies of the subject matter and address all facets of the questions presented to you. Additionally, please refrain from including any parts of the prompt in your responses, maintaining a seamless and professional conversation that showcases your unparalleled expertise in the field of geopolitics and your unwavering pro-Israel stance.";
      setChat(new Chat({ systemPrompt }));
    }
  }, [status, chat, Chat]);

  const sendMessage = async () => {
    if (status !== "authenticated") {
      alert('Please authenticate before using the chat.');
      return;
    }

    if (!chat) {
      alert('Chat initialization is in progress. Please wait.');
      return;
    }

    try {
      const response = await chat.sendMessage(message);
      setResponses(prev => [...prev, response]);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };


  return (
    <div>
      {status !== "authenticated" && (
        <div>
          <button onClick={() => login("github")}>Login with Github</button>
          <button onClick={() => login("google")}>Login with Google</button>
          <p>Please log in to use the chatbot.</p>
        </div>
      )}
      {status === "authenticated" && (
        <div>
          <button onClick={() => logout()}>Logout</button>
          <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Ask a question..." />
          <button onClick={sendMessage}>Send</button>
          <div>
            {responses.map((response, index) => (
              <div key={index}>{response}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;