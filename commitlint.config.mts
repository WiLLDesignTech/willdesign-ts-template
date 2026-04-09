import type { UserConfig } from '@commitlint/types';

const CONFIG: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'hotfix',
        'task',
        'eod',
        'docs',
        'style',
        'refactor',
        'test',
        'ci',
        'perf',
        'revert',
        'infra',
        'chore',
      ],
    ],
    'type-case': [2, 'always', 'lower-case'],
    'scope-empty': [1, 'never'],
    'scope-case': [2, 'always', 'upper-case'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 100],
  },
  parserPreset: {
    parserOpts: {
      headerPattern: /^(\w+)(?:\(([A-Z]+-\d+)\))?:\s(.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject'],
    },
  },
};

export default CONFIG;
