import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Game() {
  const [user, setUser] = useState<{ username: string; points: number } | null>(
    null
  );
  const [matchStats, setMatchStats] = useState<{
    matchesPlayed: number;
    matchesWon: number;
    message?: string;
  }>({
    matchesPlayed: 0,
    matchesWon: 0,
  });
  const navigate = useNavigate();

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

          const statsRes = await fetch(
            "https://ws-be-111659801199.asia-south2.run.app/api/v1/users/stats",
            {
              credentials: "include",
            }
          );

          if (statsRes.ok) {
            const statsData = await statsRes.json();
            setMatchStats({
              matchesPlayed: statsData.stats.matchesPlayed,
              matchesWon: statsData.stats.matchesWon,
              message: statsData.message,
            });
          }
        }
      } catch (err) {
        console.log("Failed to fetch user or match stats:", err);
      }
    };
    fetchUser();
  }, []);

  const handlePlay = () => {
    navigate("/arena");
  };

  const handleLogout = async () => {
    try {
      await fetch(
        "https://ws-be-111659801199.asia-south2.run.app/api/v1/authentication/logout",
        {
          method: "POST",
          credentials: "include",
        }
      );

      localStorage.removeItem("ws_token");
      setUser(null);

      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-800 text-white px-4">
      {/* Fixed Top Heading */}
      <header className="py-6">
        <h1 className="text-4xl font-bold text-center">stupidcoder</h1>
      </header>

      {/* Centered Content */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-10 text-center mt-36 px-6 md:px-20">
        <img
          src="/leetcode.jpeg"
          alt="Code Battle"
          className="max-w-sm h-auto rounded-xl shadow-lg"
        />

        <div className="text-left max-w-2xl">
          <h2 className="text-5xl font-extrabold mb-6 leading-tight">
            Play code battles against your friends online on the #1 Site!
          </h2>

          {user && (
            <p className="mb-4 text-lg text-gray-300 font-semibold">
              Welcome,{" "}
              <strong className="text-white text-lg">{user.username}</strong>
              <span className="mx-6 text-gray-400"></span>
              Rating:{" "}
              <strong className="text-white text-lg">{user.points}</strong>
            </p>
          )}

          {matchStats.message ? (
            <p className="mb-4 text-lg font-semibold">{matchStats.message}</p>
          ) : (
            <p className="mb-4 text-lg text-gray-300 font-semibold">
              Matches Played:{" "}
              <strong className="text-white text-lg">
                {matchStats.matchesPlayed}
              </strong>
              <span className="mx-4 text-gray-400 text-md"></span>
              Matches Won:{" "}
              <strong className="text-white text-lg">
                {matchStats.matchesWon}
              </strong>
            </p>
          )}

          <span className="mx-4 text-gray-400"></span>

          <div className="flex gap-4">
            <button
              onClick={handlePlay}
              className="bg-green-500 text-white font-semibold px-3 py-2 text-white hover:cursor-pointer rounded-lg hover:bg-green-700 text-lg"
            >
              ⚔️ Play Online
            </button>
            {user && (
              <button
                onClick={handleLogout}
                className="bg-blue text-white font-semibold px-3 py-2 rounded-lg hover:bg-white hover:text-blue-500 text-lg hover:cursor-pointer"
              >
                👋 Logout
              </button>
            )}
          </div>
        </div>
      </div>
      <div className="text-center mt-24 hover:cursor-pointer mt-48">
        <Button
          variant={"link"}
          className="hover:cursor-pointer text-lg text-gray-300 font-semibold"
          onClick={() => navigate("/howtoplay")}
        >
          How to Play?
        </Button>
      </div>
    </div>
  );
}

export default Game;
