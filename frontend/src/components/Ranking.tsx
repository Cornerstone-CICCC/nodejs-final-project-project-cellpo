import { useEffect, useState } from "react";
import axios from "axios";
type Ranker = {
  username: string;
  win: number;
  matches: number;
  _id: string;
};
const Ranking = () => {
  const [rankers, setRankers] = useState<Ranker[]>([]);
  useEffect(() => {
    const fetchRankers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3010/api/users/ranking"
        );
        setRankers(response.data);
      } catch (error) {
        console.error("Failed to fetch ranking data:", error);
      }
    };

    fetchRankers();
  }, []);
  return (
    <div>
      {rankers.map((ranker) => (
        <div key={ranker._id}>
          <span>Username: {ranker.username}</span>
          <br />
          <span>Wins: {ranker.win}</span>
          <br />
          <span>
            Win Rate: {Math.round((ranker.win / ranker.matches) * 100)}%
          </span>
        </div>
      ))}
    </div>
  );
};

export default Ranking;
