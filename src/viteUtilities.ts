import type { File, Task, Test } from 'vitest';

const getFlattenTestsForTask = (task: Task): Test[] => {
  const tests: Test[] = [];

  if (task.type === 'benchmark') {
    return tests;
  }

  if (task.type === 'test') {
    return [task];
  }

  return [...task.tasks.map(getFlattenTestsForTask).flat()];
};

export const getFlattenTestsForFile = (file: File) => file.tasks.map(getFlattenTestsForTask).flat();

export const buildTestCaseTitle = (task: Task): string => ((task.suite && task.suite.name)
  ? `${buildTestCaseTitle(task.suite)} - ${task.name}`
  : task.name);
