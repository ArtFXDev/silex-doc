import React, { useState } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import dracula from "prism-react-renderer/themes/dracula";
import axios from "axios";

export default function CodeSnippet(props) {
  const [data, setData] = useState("");
  axios.get(props.rawUrl).then((data) => {
    setData(data.data);
  });

  return (
    <div>
      <code style={{ padding: "0px 10px" }}> {props.fileName}</code>
      <Highlight
        {...defaultProps}
        theme={dracula}
        code={data}
        language={props.langage}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={className} style={style}>
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
