import { useState, useRef, useEffect } from "react";
import axios from "axios";
import FAQList from "./FAQList"; // Adjust the import path as needed

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [allFAQs, setAllFAQs] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchAllFAQs = async () => {
      try {
        const response = await axios.get("http://localhost:8000/faqs/");
        setAllFAQs(response.data);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      }
    };

    fetchAllFAQs();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleFAQClick = (faq) => {
    const newUserMessage = {
      id: Date.now().toString(),
      content: faq.question,
      isUser: true,
    };

    const newSystemResponse = {
      id: (Date.now() + 1).toString(),
      content: faq.answer,
      isUser: false,
    };

    setMessages((prev) => [...prev, newUserMessage, newSystemResponse]);

    setSearchResults([]);
  };

  const displayFAQs = (faqs, noResultsMessage = false) => {
    const newSystemResponse = {
      id: (Date.now() + 1).toString(),
      content: noResultsMessage
        ? "No results found. Here are all available FAQs to choose from."
        : "",
      isUser: false,
    };

    setMessages((prev) => [...prev, newSystemResponse]);
    setSearchResults(faqs);
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
    };

    setMessages((prev) => [...prev, newUserMessage]);

    try {
      if (inputValue.toLowerCase() === "all") {
        displayFAQs(allFAQs);
      } else {
        const searchResponse = await axios.get(
          `http://localhost:8000/faqs/search/?query=${inputValue}`,
        );

        if (searchResponse.data.length === 0) {
          displayFAQs(allFAQs, true);
        } else {
          displayFAQs(searchResponse.data);
        }
      }
    } catch (error) {
      // Handle error
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        content:
          "Sorry, there was an error processing your request. Please try again.",
        isUser: false,
      };

      setMessages((prev) => [...prev, errorMessage]);
    }

    setInputValue("");
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-100 to-blue-100 p-6 items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Chat Header */}
        <div className="bg-green-500 text-white p-4 flex items-center">
          <div className="w-10 h-10 bg-white/30 rounded-full mr-3"></div>
          <div>
            <h2 className="font-semibold">RaiDOT FAQ Assistant</h2>
          </div>
        </div>

        <div className="h-[500px] bg-green-50 p-4 overflow-y-auto space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 my-8">
              Send a message to start chatting
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.isUser ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-2xl ${
                    message.isUser
                      ? "bg-green-600 text-white rounded-br-sm"
                      : "bg-white text-gray-800 rounded-bl-sm shadow-md"
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words">
                    {message.content}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {searchResults.length > 0 && (
          <div className="bg-green-100 p-4">
            <h3 className="text-lg font-semibold mb-2 text-green-800">
              Search Results
            </h3>
            <FAQList faqs={searchResults} onFAQClick={handleFAQClick} />
          </div>
        )}

        <div className="mt-4 bg-white p-4 border-t">
          <form
            onSubmit={handleSendMessage}
            className="flex items-center space-x-2"
          >
            <input
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
                setSearchResults([]);
              }}
              placeholder="Type a message..."
              className="flex-grow p-2 border rounded-full bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-300"
            />
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ChatInterface;
