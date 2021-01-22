import { textGraphIntoExecuter } from './expression/text-graph-into-executer';

export class Engine {
  compile(code) {
    return textGraphIntoExecuter(code);
  }
}
