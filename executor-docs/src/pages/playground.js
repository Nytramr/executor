import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Engine } from '@nytramr/executor';

const e = new Engine();

const codeExample = 'AN(PP(first), PP(second))';

const dataExamples = [
  `{
  "first": true,
  "second": false,
  "array": [true, false, null],
  "object": {
    "prop1": false,
    "prop2": true,
    "prop-3": null,
    "index": 2
  },
  "index": 0,
  "key": "index"
}`,
  `{
  "first": "hello",
  "second": "",
  "array": ["a", "b", "c"],
  "object": {
    "prop1": "hello",
    "prop2": "true",
    "prop-3": "",
    "index": 0
  },
  "index": 1,
  "key": "index"
}`,
  `{
  "first": 10,
  "second": 0,
  "array": [0, 2, 4],
  "object": {
    "prop1": 23,
    "prop2": 45,
    "prop-3": 0,
    "index": 3
  },
  "index": 1,
  "key": "index"
}`,
  `{
  "first": true,
  "second": "true",
  "array": ["a", 5, true],
  "object": {
    "prop1": "hello",
    "prop2": false,
    "prop-3": 23,
    "index": 2
  },
  "index": 3,
  "key": "index"
}`,
];

function useExecutor(code) {
  try {
    const executor = e.compile(code);
    return [executor, 'compilation succeeded'];
  } catch (e) {
    return [undefined, e.message];
  }
}

function useExecutorResult(executor, data) {
  try {
    const dataObject = data && JSON.parse(data);

    return executor && executor(dataObject);
  } catch (e) {
    return e.message;
  }
}

function Sandbox({ executor, initialState = dataExamples[0] }) {
  const [data, setData] = useState(initialState);
  const result = useExecutorResult(executor, data);
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        fontSize: '20px',
        maxWidth: '250px',
        minWidth: '250px',
        marginRight: '8px',
        marginBottom: '16px',
      }}
    >
      <textarea
        style={{
          fontSize: '14px',
          marginBottom: '4px',
          flexGrow: '1',
          resize: 'none',
        }}
        onChange={(e) => setData(e.target.value)}
        value={data}
      ></textarea>
      <div
        style={{
          padding: '4px',
          border: '1px solid black',
          minHeight: '2rem',
          fontSize: '14px',
        }}
      >
        <span>{result === undefined ? 'undefined' : result === null ? 'null' : result.toString()}</span>
      </div>
    </div>
  );
}

function Playground() {
  const [executorCode, setExecutorCode] = useState(codeExample);
  const [executor, error] = useExecutor(executorCode);

  return (
    <Layout title="Playground">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          fontSize: '20px',
          backgroundColor: '#FFFFFF',
          minHeight: 'calc(100vh - 60px)',
          alignItems: 'stretch',
          padding: '8px',
          color: '#000000',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '20px',
            marginBottom: '16px',
          }}
        >
          <input
            style={{
              flexGrow: '1',
              fontSize: '20px',
              marginRight: '8px',
            }}
            onChange={(e) => setExecutorCode(e.target.value)}
            value={executorCode}
          />
          <span
            style={{
              fontSize: '10px',
            }}
          >
            {error}
          </span>
        </div>
        <div
          style={{
            flexGrow: '1',
            display: 'flex',
            justifyContent: 'left',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            fontSize: '20px',
          }}
        >
          <Sandbox executor={executor} />
          <Sandbox executor={executor} initialState={dataExamples[1]} />
          <Sandbox executor={executor} initialState={dataExamples[2]} />
          <Sandbox executor={executor} initialState={dataExamples[3]} />
        </div>
      </div>
    </Layout>
  );
}

export default Playground;
