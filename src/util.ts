import { exec } from "child_process";

export function execPromise(cmd, opts={}) {
	return new Promise<{ out: any, err: any }>((resolve, reject) => {
   		exec(cmd, opts, (error, stdout, stderr) => {
        	if(error)   reject(error);
        	else        resolve({ out: stdout.trim(), err: stderr.trim() });
		});
	});
}