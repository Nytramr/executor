function test(text) {
  const newText = text.trimStart();
  const char = newText.slice(0, 1);
  return char == ']' || char == ')';
}

function remove(text) {
  const newText = text.trimStart();
  const char = newText.slice(0, 1);
  if (char == ']' || char == ')') {
    return newText.slice(1);
  }
  return text;
}

export default {
  test,
  remove,
};
