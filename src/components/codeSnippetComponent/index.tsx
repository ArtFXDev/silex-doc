import React, { useState } from 'react';
import { CodeBlock, vs2015  } from "react-code-blocks";

export default function CodeSnippet(props) {
  const [data, setData] = useState("");
  fetch(props.rawUrl)
  .then(async data => {
    setData(await data.text())
  })

  return (
    <div>
      <code style={{padding: "0px 10px"}}> {props.fileName}</code>
      <CodeBlock
      text={data}
      language={props.langage}
      theme={vs2015}
      wrapLines
      />
    </div>
  );
}