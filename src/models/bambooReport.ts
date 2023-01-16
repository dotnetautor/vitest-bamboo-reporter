export type TestCaseResult = {
  title: string;
  fullTitle: string;
  duration: number;
  errorCount: number;
  error?: string;
};

export type BambooReport = {
  stats: {
    tests : number;
    failures : number;
    passes : number;
    skipped : number;
    duration : number;
    start? : string;
    end? : string;
  };
  failures: TestCaseResult[];
  passes: TestCaseResult[],
  skipped: TestCaseResult[],
};
