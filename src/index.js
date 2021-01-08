import { textGraphIntoStructureGraph } from './expression/text-graph-into-structured-graph';
export { graphIntoExecuter } from './expression/graph-into-executer';

export const textIntoGraph = textGraphIntoStructureGraph;

export function textIntoExecuter(text) {
  const graph = textIntoGraph(text);
  return graphIntoExecuter(graph);
}
