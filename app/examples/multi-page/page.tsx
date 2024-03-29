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
import AnswerContainer from "./components/answer-container";

export type Leaderboard = {
  name: string;
  scores: [
    {
      score: number;
      userName: string;
      displayName: string;
      imageUrl: string;
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
      nextFrameName = "question-3";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
      };

    case "question-3":
      nextFrameName = "answer-3";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
        userAnswer: buttonIndex - 1,
      };

    case "answer-3":
      nextFrameName = "question-4";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
      };

    case "question-4":
      nextFrameName = "answer-4";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
        userAnswer: buttonIndex - 1,
      };

    case "answer-4":
      nextFrameName = "question-5";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
      };

    case "question-5":
      nextFrameName = "answer-5";
      return {
        pageIndex: pageIndex + 1,
        frameName: nextFrameName,
        userAnswer: buttonIndex - 1,
      };

    case "answer-5":
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
            {quiz[0] && <FrameImage src={quiz[0]?.imageURL}></FrameImage>}

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
        <AnswerContainer
          previousFrame={previousFrame}
          quiz={quiz}
          state={state}
          position={0}
        />
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
            {quiz[1] && <FrameImage src={quiz[1]?.imageURL}></FrameImage>}

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
        <AnswerContainer
          previousFrame={previousFrame}
          quiz={quiz}
          state={state}
          position={1}
        />
      );

    case "question-3":
      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            {quiz[2] && <FrameImage src={quiz[2]?.imageURL}></FrameImage>}

            {
              quiz[2]?.answers.map((answer, index) => (
                <FrameButton key={index}>{answer}</FrameButton>
              )) as any
            }
          </FrameContainer>
        </div>
      );

    case "answer-3":
      await redis.set("answer-3", state.userAnswer);
      return (
        <AnswerContainer
          previousFrame={previousFrame}
          quiz={quiz}
          state={state}
          position={2}
        />
      );

    case "question-4":
      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            {quiz[3] && <FrameImage src={quiz[3]?.imageURL}></FrameImage>}

            {
              quiz[3]?.answers.map((answer, index) => (
                <FrameButton key={index}>{answer}</FrameButton>
              )) as any
            }
          </FrameContainer>
        </div>
      );

    case "answer-4":
      await redis.set("answer-4", state.userAnswer);
      return (
        <AnswerContainer
          previousFrame={previousFrame}
          quiz={quiz}
          state={state}
          position={3}
        />
      );

    case "question-5":
      return (
        <div>
          <FrameContainer
            pathname="/examples/multi-page"
            postUrl="/examples/multi-page/frames"
            state={state}
            previousFrame={previousFrame}
          >
            {quiz[4] && <FrameImage src={quiz[4]?.imageURL}></FrameImage>}

            {
              quiz[4]?.answers.map((answer, index) => (
                <FrameButton key={index}>{answer}</FrameButton>
              )) as any
            }
          </FrameContainer>
        </div>
      );

    case "answer-5":
      await redis.set("answer-5", state.userAnswer);
      return (
        <AnswerContainer
          previousFrame={previousFrame}
          quiz={quiz}
          state={state}
          position={4}
        />
      );

    case "finish":
      const answer1 = Number(await redis.get("answer-1"));
      const answer2 = Number(await redis.get("answer-2"));
      const answer3 = Number(await redis.get("answer-3"));
      const answer4 = Number(await redis.get("answer-4"));
      const answer5 = Number(await redis.get("answer-5"));
      const checkCorrectAnswer1 = quiz[0]?.correct === answer1 ? 1 : 0;
      const checkCorrectAnswer2 = quiz[1]?.correct === answer2 ? 1 : 0;
      const checkCorrectAnswer3 = quiz[2]?.correct === answer3 ? 1 : 0;
      const checkCorrectAnswer4 = quiz[3]?.correct === answer4 ? 1 : 0;
      const checkCorrectAnswer5 = quiz[4]?.correct === answer5 ? 1 : 0;
      const totalScore =
        ((checkCorrectAnswer1 +
          checkCorrectAnswer2 +
          checkCorrectAnswer3 +
          checkCorrectAnswer4 +
          checkCorrectAnswer5) /
          2) *
        100;

      const userIndex = leaderBoardData.scores.findIndex(
        (item) => item.userName === frameMessage?.requesterUserData?.username
      );

      frameMessage?.requesterUserData?.username;
      if (userIndex === -1) {
        leaderBoardData.scores.push({
          userName: frameMessage?.requesterUserData?.username as string,
          score: totalScore,
          displayName: frameMessage?.requesterUserData?.displayName as string,
          imageUrl: frameMessage?.requesterUserData?.profileImage
            ? frameMessage?.requesterUserData?.profileImage
            : "",
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
              <div
                tw="relative flex flex-col bg-gray-600 h-full w-full justify-center items-center text-white"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(78,4,100,1) 100%)",
                }}
              >
                <h1 tw="text-[50px]">Total Score: 130</h1>
              </div>
            </FrameImage>
            <FrameButton>TRY AGAIN</FrameButton>
            <FrameButton>SEE LEADERBOARD</FrameButton>
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
              <div
                tw="flex relative flex-col bg-gray-600 h-full w-full justify-center items-center text-white"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(78,4,100,1) 100%)",
                }}
              >
                <h1 tw="absolute top-0 m-auto text-[40px]">LEADERBOARD</h1>
                <div tw="flex flex-col max-w-full w-full h-full justify-between items-start mt-20">
                  <div tw="flex flex-row justify-start items-center w-full h-[100px] border-b border-white px-5">
                    <h1 tw="w-[40px] text-[40px]">#</h1>
                    <h1 tw="w-[40px] flex text-[40px]">User</h1>
                    <h1 tw="w-[40px] flex flex-grow justify-end text-[40px]">
                      Points
                    </h1>
                  </div>
                  <div tw="flex flex-col w-full h-full justify-start items-center px-5">
                    {leaderBoardData.scores
                      .sort((a, b) => b.score - a.score)
                      .slice(0, 5)
                      .map((item, index) => (
                        <div
                          key={index}
                          tw="flex flex-row justify-start items-center text-[40px] w-full h-[70px] mt-3"
                        >
                          <h1 tw="w-[45px] text-[40px]">{index + 1}. </h1>
                          <div tw="flex flex-row justify-start items-center w-full">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                width={50}
                                height={50}
                                alt="user-img"
                                tw="rounded-full ml-10 mr-4"
                              />
                            )}
                            <h1 tw="text-[40px]">{item.userName} </h1>
                          </div>
                          <h1 tw="w-[40px] flex flex-grow justify-end text-[40px]">
                            {item.score}
                          </h1>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </FrameImage>
            <FrameButton>TRY AGAIN</FrameButton>
            <FrameButton
              action="link"
              target={`${process.env.NEXT_PUBLIC_HOST}/leaderboard`}
            >
              SEE MORE
            </FrameButton>
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
          <div
            tw="flex flex-col bg-gray-600 h-full w-full justify-center items-center text-white relative"
            style={{
              background:
                "linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(78,4,100,1) 100%)",
            }}
          >
            <img
              width="400"
              height="100"
              src="https://www.cairo-lang.org/wp-content/uploads/2020/12/logo.png"
              alt="bg"
            />
            <h1 tw="text-[40px]">Learn Cairo now</h1>
          </div>
        </FrameImage>
        <FrameButton>START</FrameButton>
      </FrameContainer>
    </div>
  );
}
