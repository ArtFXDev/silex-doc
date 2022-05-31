import React, { useState } from 'react';
import { CodeBlock, vs2015  } from "react-code-blocks";
import axios from "axios";

export default function CodeSnippet(props) {
  const [data, setData] = useState("");
  axios.get(props.rawUrl)
  .then(data => {
    setData(data.data)
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