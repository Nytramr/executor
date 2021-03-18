export function CodeInput(props) {
  return (
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
  );
}
