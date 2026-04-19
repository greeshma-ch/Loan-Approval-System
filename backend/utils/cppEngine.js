const { spawn } = require('child_process');
const path = require('path');

const ENGINE_PATH = path.resolve(
  __dirname,
  '..',
  process.env.CPP_ENGINE_PATH || '../scoring_engine.exe'
);

/**
 * Runs the C++ scoring engine with JSON stdin/stdout.
 * @param {Object} applicationData - The loan application data
 * @returns {Promise<Object>} - Parsed JSON result from C++ engine
 */
function runScoringEngine(applicationData) {
  return new Promise((resolve, reject) => {
    const timeout = 10000; // 10 second timeout
    let stdout = '';
    let stderr = '';
    let timedOut = false;

    const child = spawn(ENGINE_PATH, ['--json'], {
      timeout,
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    // Set a manual timeout as fallback
    const timer = setTimeout(() => {
      timedOut = true;
      child.kill('SIGKILL');
      reject(new Error('C++ scoring engine timed out after 10 seconds'));
    }, timeout);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('error', (err) => {
      clearTimeout(timer);
      if (err.code === 'ENOENT') {
        reject(new Error(
          `C++ scoring engine not found at: ${ENGINE_PATH}. ` +
          `Please compile scoringlogic.cpp: g++ -o scoring_engine.exe scoringlogic.cpp`
        ));
      } else {
        reject(new Error(`Failed to start C++ engine: ${err.message}`));
      }
    });

    child.on('close', (code) => {
      clearTimeout(timer);
      if (timedOut) return;

      if (code !== 0) {
        reject(new Error(
          `C++ engine exited with code ${code}. stderr: ${stderr.trim()}`
        ));
        return;
      }

      try {
        const result = JSON.parse(stdout.trim());
        if (result.error) {
          reject(new Error(`C++ engine error: ${result.error}`));
        } else {
          resolve(result);
        }
      } catch (parseErr) {
        reject(new Error(
          `Failed to parse C++ engine output: ${parseErr.message}. Raw output: "${stdout.trim()}"`
        ));
      }
    });

    // Write the application data as JSON to stdin
    const input = JSON.stringify(applicationData);
    child.stdin.write(input);
    child.stdin.end();
  });
}

module.exports = { runScoringEngine };
