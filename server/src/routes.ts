import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check


// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};



const savedFiles: Map<string, unknown> = new Map<string, unknown>();

const savedScores: unknown[] = [];


/** Handles request for /save by storing the given file. */
export const save = (req: SafeRequest, res: SafeResponse): void => {
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  const value = req.body.value;
  if (value === undefined) {
    res.status(400).send('required argument "value" was missing');
    return;
  }
  if(savedFiles.has(name)) {
    res.send({replaced: true});
  } else {
    res.send({replaced: false});
  }
  savedFiles.set(name, value)
}

/** Handles request for /load by returning the requested file. */
export const load = (req: SafeRequest, res: SafeResponse): void => {

  const query = first(req.query.name);
  if (query === undefined) {
    res.status(400).send('required argument "name" was missing');
    return;
  }
  if(!savedFiles.has(query)) {
    res.status(404).send('name not found');
    return;
  }
  res.send({value: savedFiles.get(query)});
}

/** Handles request for /list by returning the lists of file names. */
export const list = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({keys: Array.from(savedFiles.entries())});
}

/** Used in tests to set the transcripts map back to empty. */
export const reset = (): void => {
  // Do not use this function except in tests!
  savedFiles.clear();
  savedScores.length = 0
};

/** Handles request for /saveScores by saving the given score */
export const saveScores = (req: SafeRequest, res: SafeResponse): void => {
  const value = req.body.value;
  if (value === undefined || typeof value !== 'string') {
    res.status(400).send('required argument "value" was missing');
    return;
  }
  res.send({msg:"Saved"});
  savedScores.push(value)
}


/** Handles request for /listScores by returning the lists of scores. */
export const listScores = (_req: SafeRequest, res: SafeResponse): void => {
  res.send({keys: savedScores});
}


