import React, { useState } from 'react';
import Layout from '@theme/Layout';
import { Engine } from '@nytramr/executor';

const e = new Engine();

const codeExample = 'AN(PP(first), PP(second))';

const dataExample = `
{
  "first": true,
  "second": false,
  "third": "",
  "forth": 0
}`;

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
    debugger;
    return executor && executor(dataObject);
  } catch (e) {
    return e.message;
  }
}

function Sandbox({ executor }) {
  const [data, setData] = useState(dataExample);
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
          fontSize: '20px',
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
        <span>{result === undefined ? 'undefined' : result.toString()}</span>
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
          <Sandbox executor={executor} />
          <Sandbox executor={executor} />
          <Sandbox executor={executor} />
        </div>
      </div>
    </Layout>
  );
}

export default Playground;
