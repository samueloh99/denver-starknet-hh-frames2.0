/* eslint-disable @next/next/no-img-element */
import {
  FrameButton,
  FrameContainer,
  FrameImage,
  FrameReducer,
  NextServerPageProps,
  getPreviousFrame,
  getFrameMessage,
  useFramesReducer,
} from "frames.js/next/server";
import { quizSchema, redis } from "./components/redis/config";
import { ActionIndex } from "frames.js";
import { DEBUG_HUB_OPTIONS } from "../../debug/constants";

type Leaderboard = {
  name: string;
  scores: [
    {
      score: number;
      userName: string;
    }
  ];
};

type State = {
  pageIndex: number;
  frameName: string;
  userAnswer?: number;
};

const initialState: State = {
  pageIndex: 0,
  frameName: "",
};

const reducer: FrameReducer<State> = (state, action) => {
  const buttonIndex = action.postBody?.untrustedData.buttonIndex as ActionIndex;

  let nextFrameName = state.frameName;
  let pageIndex = state.pageIndex;

  switch (nextFrameName) {
    case "":
      return {
        pageIndex,
        frameName: "question-1",
      };

    case "question-1":
      nextFrameName = "answer-1";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
        userAnswer: buttonIndex - 1,
      };

    case "answer-1":
      nextFrameName = "question-2";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
      };

    case "question-2":
      nextFrameName = "answer-2";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
        userAnswer: buttonIndex - 1,
      };

    case "answer-2":
      nextFrameName = "finish";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
      };

    case "finish":
      nextFrameName = buttonIndex === 1 ? "" : "leaderboard";
      return {
        pageIndex: 0,
        frameName: nextFrameName,
      };

    case "leaderboard":
      nextFrameName = "";
      return {
        pageIndex: 0,
        frameName: nextFrameName,
      };

    default:
      return {
        pageIndex,
        frameName: nextFrameName === "" ? "home" : nextFrameName,
      };
  }
};

// This is a react server component only
export default async function Home({
  params,
  searchParams,
}: NextServerPageProps) {
  const quiz = quizSchema.parse(await redis.get("cairo-quiz-1")).questions;
  const leaderBoardData: Leaderboard | null = await redis.get(
    "leaderboard-cairo-quiz-1"
  );

  const previousFrame = getPreviousFrame<State>(searchParams);

  const [state, nextFrame] = useFramesReducer<State>(
    reducer,
    initialState,
    previousFrame
  );

  const frameMessage = await getFrameMessage(previousFrame.postBody, {
    ...DEBUG_HUB_OPTIONS,
  });

  if (!leaderBoardData) return null;

  switch (state.frameName) {
    case "question-1":
      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage>
              <div tw="flex flex-col bg-gray-600 h-full w-full justify-center items-center text-white">
                <img src={quiz[0] && quiz[0].imageURL} alt="Image" />
              </div>
            </FrameImage>

            {
              quiz[0]?.answers.map((answer, index) => {
                return <FrameButton key={index}>{answer}</FrameButton>;
              }) as any
            }
          </FrameContainer>
        </div>
      );

    case "answer-1":
      await redis.set("answer-1", state.userAnswer);
      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage>
              <div tw="flex flex-col bg-gray-600 h-full w-full justify-center items-center text-white">
                <h1>
                  {state.userAnswer === quiz[0]?.correct
                    ? "Correct"
                    : "Incorrect"}
                </h1>
                <h1>Correct answer: {quiz[0]?.answers[quiz[0].correct]}</h1>
                <h1>
                  Your answer: {quiz[0]?.answers[state.userAnswer as number]}
                </h1>
              </div>
            </FrameImage>
            <FrameButton>Next Question</FrameButton>
          </FrameContainer>
        </div>
      );

    case "question-2":
      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage>
              <div tw="flex flex-col bg-gray-600 h-full w-full justify-center items-center text-white">
                <img src={quiz[1] && quiz[1].imageURL} alt="Image" />
              </div>
            </FrameImage>
            {
              quiz[1]?.answers.map((answer, index) => (
                <FrameButton key={index}>{answer}</FrameButton>
              )) as any
            }
          </FrameContainer>
        </div>
      );

    case "answer-2":
      await redis.set("answer-2", state.userAnswer);
      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage>
              <div tw="flex flex-col bg-gray-600 h-full w-full justify-center items-center text-white">
                <h1>
                  {state.userAnswer === quiz[1]?.correct
                    ? "Correct"
                    : "Incorrect"}
                </h1>
                <h1>Correct answer: {quiz[1]?.answers[quiz[1].correct]}</h1>
                <h1>
                  Your answer: {quiz[1]?.answers[state.userAnswer as number]}
                </h1>
              </div>
            </FrameImage>
            <FrameButton>Next Question</FrameButton>
          </FrameContainer>
        </div>
      );

    case "finish":
      const answer1 = Number(await redis.get("answer-1"));
      const answer2 = Number(await redis.get("answer-2"));
      const checkCorrectAnswer1 = quiz[0]?.correct === answer1 ? 1 : 0;
      const checkCorrectAnswer2 = quiz[1]?.correct === answer2 ? 1 : 0;
      const totalScore =
        ((checkCorrectAnswer1 + checkCorrectAnswer2) / 2) * 100;

      const userIndex = leaderBoardData.scores.findIndex(
        (item) => item.userName === frameMessage?.requesterUserData?.username
      );

      if (userIndex > -1) {
        // User exists, update score if the new score is higher
        const actualScore = leaderBoardData.scores[userIndex];
        if (actualScore) {
          if (totalScore > actualScore.score) {
            actualScore.score = totalScore;
          }
        }
      } else {
        // User doesn't exist, add them with the current score
        leaderBoardData.scores.push({
          userName: frameMessage?.requesterUserData?.username as string,
          score: totalScore,
        });
      }

      await redis.set(
        "leaderboard-cairo-quiz-1",
        JSON.stringify(leaderBoardData)
      );

      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage>
              <div tw="flex flex-col bg-gray-600 h-full w-full justify-center items-center text-white">
                <h1>You have finished the quiz</h1>
                <h1>Total Score: {totalScore}</h1>
              </div>
            </FrameImage>
            <FrameButton>TRY AGAIN</FrameButton>
            <FrameButton
              action="link"
              target={`${process.env.NEXT_PUBLIC_HOST}/leaderboard`}
            >
              SEE LEADERBOARD
            </FrameButton>
          </FrameContainer>
        </div>
      );

    case "leaderboard":
      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            <FrameImage>
              <div tw="flex relative flex-col bg-gray-600 h-full w-full justify-center items-center text-white">
                <h1 tw="absolute top-0 m-auto text-[40px]">LEADERBOARD</h1>
                <div tw="flex flex-wrap max-w-full w-full justify-between items-center mt-20 px-5">
                  {leaderBoardData.scores.slice(0, 12).map((item, index) => (
                    <h1 key={index} tw="text-[40px]">
                      {index + 1}. {item.userName} - {item.score}
                    </h1>
                  ))}
                </div>
              </div>
            </FrameImage>
            <FrameButton>TRY AGAIN</FrameButton>
            <FrameButton>SEE MORE</FrameButton>
          </FrameContainer>
        </div>
      );

    default:
      break;
  }

  return (
    <div>
      <FrameContainer
        pathname="/examples/multi-page"
        postUrl="/examples/multi-page/frames"
        state={state}
        previousFrame={previousFrame}
      >
        <FrameImage>
          <div tw="flex flex-col bg-gray-600 h-full w-full justify-center items-center text-white">
            <h1>CAIRO QUIZ GAME</h1>
          </div>
        </FrameImage>
        <FrameButton>START GAME</FrameButton>
      </FrameContainer>
    </div>
  );
}
