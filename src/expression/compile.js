/**
 * Compiler it transforms a graph like structure into an executable function
 */

export function compile(graph) {
  if (Array.isArray(graph)) {
    const operation = graph[0];
    const arg1 = compile(graph[1]);
    const arg2 = compile(graph[2]);

    return operation(arg1, arg2);
  }

  return graph;
}
