import { Link } from "react-router-dom";

const Home = () => {
  return (
    <>
      <div className="flex flex-col justify-evenly items-center w-screen h-full bg-red-900 bg-gradient-to-t from-blue-900 text-center">
        <img
          src="../../public/tic-tac-toe_logo.png"
          alt="logo"
          className="w-80"
        />
        {/* <h1 className="mt-6 text-3xl font-extrabold text-center font-MICRO text-stone-200">
          Welcome to Home Page
          </h1> */}
        <Link
          to="/signIn"
          className="font-MICRO bg-green-600 text-3xl p-3 px-10 rounded-full text-slate-200 hover:bg-green-700 transition-all duration-300"
        >
          Sign In
        </Link>
      </div>

      <main className="bg-slate-700 w-full h-full px-8">
        <section className="flex justify-around items-center pt-5 pb-14">
          <img
            src="../../public/tic-tac-toe_no-background.png"
            alt="tic-tac-toe"
            className="w-52"
          />
          <article className="font-MICRO text-stone-200 w-1/2">
            <h1 className="text-5xl py-5">How to play tic-tac-toe?</h1>
            <p className="text-lg">
              The rules of Tic-Tac-Toe are very simple. The player who first
              forms a row of their marks vertically, horizontally, or diagonally
              wins. On your turn, you can place your piece anywhere you like on
              the board. Compete to see who can form a row first!
            </p>
          </article>
        </section>

        <section className="flex flex-row-reverse justify-around items-center pt-5">
          <img
            src="../../public/good_effect_brains.png"
            alt="brain"
            className="w-52 h-auto"
          />
          <article className="font-MICRO text-stone-200">
            <h1 className="text-5xl py-5">How good to our brains?</h1>
            <ol className="text-lg w-[50vw]">
              <li>
                Enhances Strategic Thinking:
                <p>
                  Playing Tic-Tac-Toe requires planning and anticipating your
                  opponent's moves, which helps develop strategic thinking and
                  problem-solving skills.
                </p>
              </li>
              <li>
                Improves Decision-Making Skills:
                <p>
                  The game encourages quick and thoughtful decision-making, as
                  players must choose the best moves to maximize their chances
                  of winning while blocking their opponent.
                </p>
              </li>
              <li>
                Boosts Pattern Recognition:
                <p>
                  By identifying patterns and predicting outcomes, players
                  strengthen their ability to recognize and respond to visual
                  and logical patterns, a skill applicable in many areas of
                  life.
                </p>
              </li>
            </ol>
          </article>
        </section>
      </main>
    </>
  );
};

export default Home;
