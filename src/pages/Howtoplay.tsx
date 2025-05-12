import { Link } from "react-router-dom";

function HowToPlay() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-400 to-blue-800 text-white px-6 py-10">
      <h1 className="text-4xl font-bold text-center mb-10">How to Play 🕹️</h1>

      <div className="max-w-4xl mx-auto text-lg leading-relaxed space-y-6 font-semibold">
        <p>
          <strong>stupidcoder</strong> is a competitive coding platform where
          you can challenge your friends in fast-paced 1 vs 1 algorithm battles.
        </p>

        <p>
          Each user starts with a rating of <strong>800</strong> points. For
          every battle you{" "}
          <span className="text-green-200 font-semibold">win</span>, you gain{" "}
          <strong>+10</strong> rating points. If you{" "}
          <span className="text-red-200 font-semibold">lose</span>, refresh, or
          leave during a match, you lose <strong>-10</strong> points.
        </p>

        <p>
          When you click <span className="font-semibold">"Play Online"</span>,
          you’ll be matched with another player in real-time. A DSA (Data
          Structures and Algorithms) question will be sent to both players.
        </p>

        <p>
          You can either solve the problem in your own editor first and paste
          the solution here, or directly write and test it in the built-in code
          editor.
        </p>

        <p>
          Your solution should read input as described in the prompt and print
          the output exactly as expected. Make sure you handle input/output
          properly – just like in any online judge environment.
        </p>

        <p>
          The first player to submit the correct solution wins the match! The
          system checks your code automatically and updates ratings accordingly.
        </p>
      </div>

      <div className="text-center mt-12">
        <Link
          to="/game"
          className="inline-block bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-lg text-lg"
        >
          Back to Game
        </Link>
      </div>
    </div>
  );
}

export default HowToPlay;
