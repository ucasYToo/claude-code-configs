#!/usr/bin/env node
/**
 * Skill Retro Trigger
 *
 * Stop hook script that detects skill/command invocations in the session
 * and prompts for a retrospective review.
 *
 * Reads transcript_path from stdin JSON (Claude Code hook input).
 */

const fs = require('fs');

const MAX_STDIN = 1024 * 1024;
let stdinData = '';
process.stdin.setEncoding('utf8');

process.stdin.on('data', chunk => {
  if (stdinData.length < MAX_STDIN) {
    const remaining = MAX_STDIN - stdinData.length;
    stdinData += chunk.substring(0, remaining);
  }
});

process.stdin.on('end', () => {
  try {
    const input = JSON.parse(stdinData);
    const transcriptPath = input.transcript_path;

    if (!transcriptPath || !fs.existsSync(transcriptPath)) {
      console.log(stdinData);
      return;
    }

    const lines = fs.readFileSync(transcriptPath, 'utf8').split('\n').filter(Boolean);
    // Focus on recent messages to avoid false positives from old sessions
    const recent = lines.slice(-40);

    const skills = new Set();
    let errorCount = 0;
    let hasBuildError = false;
    let hasTypeError = false;

    for (const line of recent) {
      try {
        const msg = JSON.parse(line);

        // Detect skill/command invocations from user messages
        if (msg.role === 'user' && typeof msg.content === 'string') {
          const matches = msg.content.match(/^\/([a-z0-9-]+)/g);
          if (matches) {
            matches.forEach(m => skills.add(m.replace('/', '')));
          }
          // Also detect agent mentions like "run skill-retrospective"
          const agentMatch = msg.content.match(/\b(skill-retrospective|code-reviewer|security-reviewer|build-error-resolver)\b/);
          if (agentMatch) skills.add(agentMatch[1]);
        }

        // Detect tool errors in assistant tool outputs
        if (msg.role === 'assistant' && msg.tool_outputs) {
          for (const out of msg.tool_outputs) {
            const output = out.output || '';
            const isError = out.error !== undefined && out.error !== null && out.error !== false;
            if (isError) errorCount++;
            if (typeof output === 'string') {
              if (/error|Error|failed|FAIL|exception/i.test(output)) errorCount++;
              if (/Build failed|build error|Compilation failed/i.test(output)) hasBuildError = true;
              if (/TypeScript error|type error|tsc.*error/i.test(output)) hasTypeError = true;
            }
          }
        }

        // Detect errors in tool_use results
        if (msg.content && typeof msg.content === 'string') {
          if (/error|Error|failed/i.test(msg.content)) errorCount++;
        }
      } catch {
        // Skip malformed lines
      }
    }

    if (skills.size > 0) {
      const skillList = Array.from(skills).join(', ');
      console.error(`[SkillRetro] 本次会话检测到调用: ${skillList}`);

      const details = [];
      if (errorCount > 0) details.push(`${errorCount} 个工具异常`);
      if (hasBuildError) details.push('构建失败');
      if (hasTypeError) details.push('类型错误');

      if (details.length > 0) {
        console.error(`[SkillRetro] 检测到问题: ${details.join('、')}`);
      }

      console.error(`[SkillRetro] 建议回顾执行质量。输入"回顾"或"运行 retrospective"，Claude 将调用 skill-retrospective agent 分析本次调用。`);
    }
  } catch {
    // Silently fail to avoid disrupting the session
  }

  // Must echo stdin back for the hook chain
  console.log(stdinData);
});
