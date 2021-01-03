import { constant, not } from './executers';
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
  _N: not,
};

// const instructionRegEx = /^(_[CN]+)(\(.*)/; //first group: the instruction, second group: rest
const instructionRegEx = /^(_[CN]+)\(\s*(.*)/; //first group: the instruction, second group: rest

const endOfArgsRegEx = /^\),?\s*(.*)/; // detect and remove a closing parenthesis
const startOfArgsRegEx = /^\((.*)/; // detect and remove a opening parenthesis
const stringRegEx = /^(?:"([^"]*)"|'([^']*)'),?\s*(.*)/; // string argument, first group: double quotes string, second group: single quotes string, third group: rest.
const numberRegEx = /^(-?\d+(?:\.\d+)?),?\s*(.*)/; // string argument, first group: number, second group: rest.

function parseInstruction(match) {
  const executer = executers[match[1]];
  if (!executer) {
    throw new Error(`Executer ${match[1]} wasn't recognized`);
  }

  const args = parseNext(match[2], []);

  return parseNext(args[1], [executer, ...args[0]]);
}

function parseMatch(match) {
  return parseNext(endOfArgs[1], accum);
}

const parsers = [[instructionRegEx, parseInstruction]];

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

    console.log('instruction', instruction);
    const args = parseNext(instruction[2], []);
    console.log('args', args);

    return parseNext(args[1], [...accum, [executer, ...args[0]]]);
  }

  const endOfArgs = endOfArgsRegEx.exec(text);
  if (endOfArgs) {
    console.log('endOfArgs', endOfArgs, accum);
    return [accum, endOfArgs[1]];
  }

  // const startOfArgs = startOfArgsRegEx.exec(text);
  // if (startOfArgs) {
  //   const args = parseNext(startOfArgs[1], []);
  //   return parseNext()
  // }

  const stringArg = stringRegEx.exec(text);
  if (stringArg) {
    console.log(stringArg);
    const value = stringArg[1] || stringArg[2] || '';

    return parseNext(stringArg[3], accum.concat(value));
  }

  const numberArg = numberRegEx.exec(text);
  if (numberArg) {
    const value = +numberArg[1]; // convert into number
    console.log('numbers', numberArg);
    return parseNext(numberArg[2], accum.concat(value));
  }

  return []; // TODO: Throw error when the text has no match
}

export function textIntoGraph(text) {
  if (text === '') {
    return [];
  }

  const graph = parseNext(text, []);

  if (graph[0].length > 1) {
    throw new Error(`The expression ${text} has more than a main instruction close to ""`);
  }

  return graph[0][0];
}
