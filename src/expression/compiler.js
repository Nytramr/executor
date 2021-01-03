import { constant } from './executers';
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

const executers = {
  _C: constant,
};

const instructionRegEx = /^(_[C]+)\((.*)/; //first group: the instruction, second group: rest

const endOfArgsRegEx = /^\)(.*)/; // detect and remove a close parenthesis
const stringRegEx = /^(?:"([^"]*)"|'([^']*)'),?(.*)/; // string argument, first group: double quotes string, second group: single quotes string, third group: rest.
const numberRegEx = /^(-?\d+(?:\.\d+)?),?(.*)/; // string argument, first group: number, second group: rest.

function parseNext(text, accum) {
  if (!text) {
    return [accum, ''];
  }

  const instruction = instructionRegEx.exec(text);

  if (instruction) {
    const executer = executers[instruction[1]];
    if (!executer) {
      throw new Error(`Executer ${instruction[1]} wasn't recognized`);
    }

    const args = parseNext(instruction[2], []);

    return parseNext(args[1], [executer, ...args[0]]);
  }

  const endOfArgs = endOfArgsRegEx.exec(text);
  if (endOfArgs) {
    return parseNext(endOfArgs[1], accum);
  }

  const stringArg = stringRegEx.exec(text);
  if (stringArg) {
    const value = stringArg[1] || stringArg[2] || '';

    return parseNext(stringArg[3], accum.concat(value));
  }

  const numberArg = numberRegEx.exec(text);
  if (numberArg) {
    const value = +numberArg[1]; // convert into number

    return parseNext(numberArg[2], accum.concat(value));
  }

  return []; // TODO: Throw error when the text has no match
}

export function textIntoGraph(text) {
  if (text === '') {
    return [];
  }

  const graph = parseNext(text);

  if (graph.length > 2) {
    throw new Error(`The expression ${text} has more than a main instruction close to ""`);
  }

  return graph[0];
}
