import { FrameButton, FrameContainer, FrameImage } from "frames.js/next/server";

interface AnswerContainerProps {
  state: any;
  previousFrame: any;
  quiz: any;
  position: number;
}

export default function AnswerContainer({
  state,
  previousFrame,
  quiz,
  position,
}: AnswerContainerProps) {
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
            {state.userAnswer === quiz[position]?.correct ? (
              <div tw="flex flex-row justify-center items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="80"
                  height="80"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#19b82c"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  className="lucide lucide-check-circle-2"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
                <h1 tw="text-[50px] text-[#19b82c] pl-5">
                  {quiz[position]?.answers[state.userAnswer as number]}
                </h1>
              </div>
            ) : (
              <div tw="flex flex-col">
                <h1 tw="text-[60px] flex flex-row justify-center items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="80"
                    height="80"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#b81929"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    className="lucide lucide-x-circle"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="m15 9-6 6" />
                    <path d="m9 9 6 6" />
                  </svg>
                  <h1 tw="text-[60px] text-[#b81929] pl-10">
                    {quiz[position]?.answers[state.userAnswer as number]}
                  </h1>
                </h1>
                Correct answer:{" "}
                {quiz[position]?.answers[quiz[position].correct]}
              </div>
            )}
          </div>
        </FrameImage>
        <FrameButton>Next Question</FrameButton>
      </FrameContainer>
    </div>
  );
}
