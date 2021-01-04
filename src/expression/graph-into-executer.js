/**
 * graphIntoExecuters transforms a graph like structure into an executable function
 */

export function graphIntoExecuter(graph) {
  if (Array.isArray(graph)) {
    const operation = graph[0];
    const arg1 = graphIntoExecuter(graph[1]);
    const arg2 = graphIntoExecuter(graph[2]);

    return operation(arg1, arg2);
  }

  return graph;
}
