import React from "react";
import env from "./env";

interface AppProps {
  content: string;
}

export default function App(props: AppProps) {
  const {content} = props;

  return (
    <div>
      <p>{content}</p>
      <p>Environment variable: {env.TEST_VAR}</p>
    </div>
  );
}
