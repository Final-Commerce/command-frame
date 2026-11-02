import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ACTION_LABEL_COMMANDS } from './action-labels';

const ACTIONS_DIR = join(__dirname, '../../actions');
const LABEL_LINE = /^\*\*Action label:\*\*.*data-final-action="(\w+)"/m;

/** Every action README that carries an **Action label:** line, with the command it names. */
function labelledReadmes(): { folder: string; command: string }[] {
  return readdirSync(ACTIONS_DIR)
    .filter((folder) => existsSync(join(ACTIONS_DIR, folder, 'README.md')))
    .flatMap((folder) => {
      const command = readFileSync(join(ACTIONS_DIR, folder, 'README.md'), 'utf8').match(LABEL_LINE)?.[1];
      return command ? [{ folder, command }] : [];
    });
}

const kebab = (name: string) => name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

describe('action labels', () => {
  it('README lines name exactly the commands in ACTION_LABEL_COMMANDS', () => {
    const fromReadmes = labelledReadmes()
      .map((r) => r.command)
      .sort();
    expect(fromReadmes).toEqual([...ACTION_LABEL_COMMANDS].sort());
  });

  it('each line sits in the README of the command it names', () => {
    for (const { folder, command } of labelledReadmes()) expect(folder).toBe(kebab(command));
  });
});
