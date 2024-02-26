import NextImage from "next/image";
import { redis } from "../examples/multi-page/components/redis/config";
import { Leaderboard } from "../examples/multi-page/page";
import { UserRound } from "lucide-react";

export default async function LeaderboardPage() {
  const leaderBoardData: Leaderboard | null = await redis.get(
    "leaderboard-cairo-quiz-1"
  );

  if (!leaderBoardData) return <div>Loading...</div>;

  return (
    <div className="flex w-full h-screen justify-center items-start bg-stone-800 text-white">
      <div className="flex flex-col justify-center items-center w-full h-full">
        <h1>Leaderboard</h1>

        <div className="flex flex-row text-center justify-start items-start w-full px-10 mt-10">
          <h1 className="w-[40px] flex">#</h1>
          <h1 className="w-[40px] flex">User</h1>
          <h1 className="w-[40px] flex flex-grow justify-end">Points</h1>
        </div>
        <div className="flex flex-col justify-start items-center w-full flex-grow mt-5">
          {leaderBoardData.scores
            .sort((a, b) => b.score - a.score)
            .map((user, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center w-full px-10 py-3 border-b border-gray-600"
                >
                  <h1 className="w-[40px]">{index + 1}</h1>
                  <div className="flex items-center justify-start flex-grow w-[40px] gap-5">
                    {user.imageUrl !== "" ? (
                      <NextImage
                        about="user-avatar"
                        width={50}
                        className="rounded-full"
                        height={50}
                        src={user.imageUrl}
                        alt="User"
                      />
                    ) : (
                      <UserRound size={30} />
                    )}
                    <div className="flex flex-col justify-start items-start">
                      <h1 className="font-bold text-lg">{user.displayName}</h1>
                      <h1 className="text-md">@{user.userName}</h1>
                    </div>
                  </div>
                  <h1>{user.score}</h1>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}
