import { registerRoot, Composition } from "remotion";
import React from "react";
import { Reel, SLIDE_SECS } from "./Reel";
import sample from "../sample-carousel.json";

const FPS = 30;

const Root: React.FC = () => (
  <Composition
    id="Reel"
    component={Reel as any}
    fps={FPS}
    width={1080}
    height={1920}
    defaultProps={sample as any}
    calculateMetadata={({ props }: any) => ({
      durationInFrames: Math.max(1, Math.round((props.slides?.length || 8) * SLIDE_SECS * FPS)),
    })}
  />
);

registerRoot(Root);
