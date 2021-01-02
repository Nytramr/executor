/**
 * Compiler it transforms a graph like structure into an executable function
 */

export function graphIntoExecuters(graph) {
  if (Array.isArray(graph)) {
    const operation = graph[0];
    const arg1 = graphIntoExecuters(graph[1]);
    const arg2 = graphIntoExecuters(graph[2]);

    return operation(arg1, arg2);
  }

  return graph;
}
