#!/usr/bin/env node
// Node.js reads stdin asynchronously with events
let input = "";
process.stdin.on("data", (chunk) => (input += chunk));
process.stdin.on("end", () => {
  const data = JSON.parse(input);

  const model = data.model.display_name;

  const utilizedTokens =
    (Number(data.context_window.total_input_tokens) +
      Number(data.context_window.total_output_tokens) || 0) / 1000;
  const windowSize = Number(data.context_window.context_window_size) / 1000;
  const contextWindowUtilization = `${utilizedTokens}k/${windowSize}k`;

  const fiveHourUtilization = Math.floor(data.rate_limits?.five_hour?.used_percentage || 0);
  const fiveHourUtilizationFilled = Math.floor((fiveHourUtilization * 10) / 100);
  const fiveHourUtilizationBar =
    "▓".repeat(fiveHourUtilizationFilled) + "░".repeat(10 - fiveHourUtilizationFilled);

  // const weekUtilization = Math.floor(data.rate_limits?.seven_day?.used_percentage || 0);
  // const weekUtilizationFilled = Math.floor(weekUtilization * 10 / 100);
  // const weekUtilizationBar = '▓'.repeat(weekUtilizationFilled) + '░'.repeat(10 - weekUtilizationFilled);

  console.log(`[${model}] ${contextWindowUtilization} [${fiveHourUtilizationBar}]`);
});
