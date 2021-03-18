function useExecutor(engine, code) {
  try {
    const executor = engine.compile(code);
    return [executor, 'compilation succeeded'];
  } catch (error) {
    return [undefined, error.message];
  }
}

function useExecutorResult(executor, data) {
  try {
    const dataObject = data && JSON.parse(data);

    return executor && executor(dataObject);
  } catch (error) {
    return error.message;
  }
}
