import { useEffect, useRef, useState } from "react";
import CodeEditor from "../components/CodeEditor";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

function Arena() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [question, setQuestion] = useState<{
    title?: string;
    description?: string;
    inputFormat?: string;
    outputFormat?: string;
    exampleInput?: string;
    exampleOutput?: string;
  }>({});
  const [answer, setAnswer] = useState<string>("//Start typing here...");
  const [languageId, setLanguageId] = useState(63);
  const [isFinding, setIsFinding] = useState(false);
  const [user, setUser] = useState<{ username: string; points: number } | null>(
    null
  );
  const [opponent, setOpponent] = useState<{
    username: string;
    points: number;
  } | null>(null);
  const [totalMatchesPlayed, setTotalMatchesPlayed] = useState<number | null>(
    null
  );

  const questionRef = useRef(question);
  const wasMatchedRef = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.classList.add("h-full");
    document.body.classList.add("h-full", "m-0", "overflow-hidden");
    document.body.style.background =
      "linear-gradient(to bottom, #38bdf8, #1e40af)";

    return () => {
      document.documentElement.classList.remove("h-full");
      document.body.classList.remove("h-full", "m-0", "overflow-hidden");
      document.body.style.background = "";
    };
  }, []);

  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          "https://ws-be-111659801199.asia-south2.run.app/api/v1/authentication/me",
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          setUser({ username: data.data.username, points: data.data.points });
        }

        const totalRes = await fetch(
          "https://ws-be-111659801199.asia-south2.run.app/api/v1/users/totalMatchesPlayed",
          {
            credentials: "include",
          }
        );

        if (totalRes.ok) {
          const totalData = await totalRes.json();
          setTotalMatchesPlayed(totalData.data.totalMatchesPlayed);
        }
      } catch (err) {
        console.log("Failed to fetch user:", err);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (question.title && question.description) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    if (question.title && question.description) {
      window.addEventListener("beforeunload", handleBeforeUnload);
    } else {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [question]);

  const startChallenge = () => {
    console.log("Clicked on Find");

    const token = localStorage.getItem("ws_token");
    if (!token) {
      console.log("No token found");
      return;
    }

    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.close();
    }

    setQuestion({});
    setMessage("Looking for an opponent...");
    setIsFinding(true);
    wasMatchedRef.current = false;

    const newSocket = new WebSocket(
      `wss://ws-be-111659801199.asia-south2.run.app/api/v1/ws?token=${token}`
    );

    let timeoutId: NodeJS.Timeout;

    newSocket.onopen = () => {
      console.log("Connected to websocket");
      setMessage("Looking for an opponent...");
    };

    newSocket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("Received: ", data);

        switch (data.type) {
          case "question":
            wasMatchedRef.current = true;
            clearTimeout(timeoutId);
            setQuestion({
              title: data.message.title,
              description: data.message.description,
              inputFormat: data.message.input_format,
              outputFormat: data.message.output_format,
              exampleInput: data.message.example_input,
              exampleOutput: data.message.example_output,
            });
            if (data.opponent) {
              setOpponent({
                username: data.opponent.username,
                points: data.opponent.points,
              });
            }
            setMessage("");
            setIsFinding(false);
            break;

          case "feedback":
            wasMatchedRef.current = false;
            const msg = data.message.toLowerCase();
            if (msg.includes("you won") || msg.includes("you lost")) {
              setQuestion({});
              setTimeout(() => {
                window.location.reload();
              }, 5000);
            }
            setMessage(data.message);
            break;

          default:
            console.warn("Unknown message type:", data.type);
        }
      } catch (error) {
        console.log("Error parsing websocket connection:", error);
      }
    };

    newSocket.onclose = () => {
      console.log("Disconnected from websocket");
      clearTimeout(timeoutId);
      if (
        !questionRef.current.title &&
        !questionRef.current.description &&
        !wasMatchedRef.current
      ) {
        setMessage("No opponent found. Try again.");
      } else {
        setMessage("Connection closed.");
      }
      setIsFinding(false);
    };

    setSocket(newSocket);

    timeoutId = setTimeout(() => {
      if (
        !questionRef.current.title &&
        !questionRef.current.description &&
        !wasMatchedRef.current
      ) {
        console.log("No opponent found within 10 seconds");
        setMessage("No opponent found. Try again.");
        setIsFinding(false);
        if (newSocket.readyState === WebSocket.OPEN) {
          newSocket.close();
        }
      }
    }, 10000);
  };

  const submitAnswer = () => {
    if (!socket) {
      console.log("Web socket is not connected");
      return;
    }

    socket.send(
      JSON.stringify({ type: "answer", answer, language_id: languageId })
    );
    setAnswer("");
  };

  useEffect(() => {
    return () => {
      if (socket) {
        socket.close();
        console.log("Websocket closed on unmount");
      }
    };
  }, [socket]);

  const stripFirstLineIndent = (str: string = "") => {
    if (!str) return "";

    const lines = str.split("\n");
    if (lines.length === 0) return "";

    const minIndent =
      lines
        .filter((line) => line.trim() !== "")
        .reduce((min, line) => {
          const indent = line.match(/^\s*/)?.[0].length || 0;
          return indent < min ? indent : min;
        }, Infinity) || 0;

    const deindentedLines = lines.map((line) => {
      if (line.trim() === "") return "";
      return line.substring(minIndent);
    });

    return deindentedLines.join("\n").trimEnd();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-sky-400 to-blue-800 text-white p-4 flex flex-col">
      {!question.title ? (
        <div className="h-full items-center">
          <header className="py-6">
            <h1 className="text-4xl font-bold text-center">New Game 🕹️</h1>
          </header>
          {user && (
            <div className="mt-24 text-center">
              <h2 className="font-semibold mb-2 text-3xl">
                Play more to win more, {user.username} ✊🏼
              </h2>
              <div className="text-center text-lg font-semibold mt-36 mb-4">
                <span className="text-white">{user.username}</span> (
                <span className="text-white">{user.points} points</span>)
              </div>
            </div>
          )}

          <div className="flex flex-col items-center">
            <button
              onClick={startChallenge}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg disabled:opacity-50 hover:cursor-pointer mb-4"
              disabled={isFinding}
            >
              {isFinding ? "Finding..." : "Find Opponent"} 🔍
            </button>
          </div>

          {message && (
            <p className="px-4 py-2 rounded text-md mb-4 text-center font-semibold">
              {message}
            </p>
          )}

          <div className="text-center mt-24 hover:cursor-pointer">
            <Button
              variant={"link"}
              className="hover:cursor-pointer text-lg text-gray-300 font-semibold"
              onClick={() => navigate("/howtoplay")}
            >
              👈🏼 Dashboard
            </Button>
          </div>

          {totalMatchesPlayed !== null && (
            <div className="text-center mt-64">
              <p className="text-md">
                <strong className="font-semibold">{totalMatchesPlayed}</strong>{" "}
                <span className="text-gray-300 font-semibold">
                  Games completed on platform
                </span>
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col h-full">
          {opponent && (
            <div className="text-lg font-medium flex justify-between bg-white/10 p-2 rounded-lg mb-2">
              <div>
                🧑 {user?.username} ({user?.points})
              </div>
              <div className="text-lg font-bold">vs</div>
              <div>
                👤 {opponent.username} ({opponent.points})
              </div>
            </div>
          )}

          <div className="bg-white/10 p-3 rounded-lg mb-2 text-left overflow-auto max-h-[30vh]">
            <h2 className="text-xl font-bold text-center mb-2">
              {question.title}
            </h2>
            <p className="text-md mb-2">{question.description}</p>
            <div className="grid grid-cols-2 gap-3 text-md">
              <div>
                <strong>Input:</strong> {question.inputFormat}
              </div>
              <div>
                <strong>Output:</strong> {question.outputFormat}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-2">
              <div>
                <strong>Example Input:</strong>
                <pre className="bg-black/30 p-2 mt-1 rounded-md whitespace-pre-wrap text-xs">
                  {stripFirstLineIndent(question.exampleInput)}
                </pre>
              </div>
              <div>
                <strong>Example Output:</strong>
                <pre className="bg-black/30 p-2 mt-1 rounded-md whitespace-pre-wrap text-xs">
                  {stripFirstLineIndent(question.exampleOutput)}
                </pre>
              </div>
            </div>
          </div>

          {/* Code editor */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex-1 overflow-hidden mb-2">
              <CodeEditor
                code={answer}
                setCode={setAnswer}
                languageId={languageId}
                setLanguageId={setLanguageId}
              />
            </div>
            <button
              onClick={submitAnswer}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-2 rounded-lg self-center hover:cursor-pointer"
            >
              Submit Answer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Arena;
