import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import type { Reporter, File, Vitest } from 'vitest';

import { BambooReport, TestCaseResult } from './models/bambooReport';
import { buildTestCaseTitle, getFlattenTestsForFile } from './viteUtilities';

export default class BambooReporter implements Reporter {
  ctx!: Vitest;

  outputFile!: string;

  onInit(ctx: Vitest) {
    this.ctx = ctx;

    if (!this.ctx.config.outputFile) {
      throw new Error(
        'BambooReporter requires config.outputFile to be defined in vite config',
      );
    }

    this.outputFile = typeof ctx.config.outputFile === 'string'
      ? ctx.config.outputFile
      : ctx.config.outputFile['vitest-bamboo-reporter'];

    // throw error if output file is not defined
    if (!this.outputFile || typeof this.outputFile !== 'string') {
      throw new Error(
        'BambooReporter requires config.outputFile to be defined in vite config',
      );
    }

    if (existsSync(this.outputFile)) {
      rmSync(this.outputFile);
    }
  }

  onFinished(files: File[] = []) {
    const reportFile = resolve(this.ctx.config.root, this.outputFile);

    const outputDirectory = dirname(reportFile);
    if (!existsSync(outputDirectory)) {
      mkdirSync(outputDirectory, { recursive: true });
    }

    const report: BambooReport = {
      stats: {
        tests: 0,
        failures: 0,
        passes: 0,
        skipped: 0,
        duration: 0,
      },
      failures: [],
      passes: [],
      skipped: [],
    };

    const allTests = files.map(getFlattenTestsForFile).flat();
    allTests.forEach((test) => {
      const title = test.name;
      const fullTitle = buildTestCaseTitle(test);

      const result: TestCaseResult = {
        title,
        fullTitle,
        duration: Math.round(test.result?.duration || 0),
        errorCount: 0,
      };

      if (test.result?.state === 'fail') {
        result.errorCount = test.result!.errors?.length || 1;
        result.error = test.result!.errors?.map((e) => e.message).join('; ') || '';

        report.failures.push(result);
      } else if (
        test.mode === 'skip'
        || test.mode === 'todo'
        || test.result?.state === 'skip'
        || test.result?.state === 'todo') {
        report.skipped.push(result);
      } else {
        report.passes.push(result);
      }
    });

    report.stats.tests = report.failures.length + report.passes.length + report.skipped.length;
    report.stats.failures = report.failures.length;
    report.stats.passes = report.passes.length;
    report.stats.skipped = report.skipped.length;
    report.stats.duration = Math.round(allTests.reduce((acc, test) => acc + (test.result?.duration || 0), 0));

    const start = allTests.reduce<number>((acc, test) => {
      const startTime = test.result?.startTime || Number.MAX_SAFE_INTEGER;
      return startTime < acc ? startTime : acc;
    }, Number.MAX_SAFE_INTEGER);

    if (start !== Number.MAX_SAFE_INTEGER) {
      report.stats.start = new Date(start).toISOString();
      report.stats.end = new Date(start + report.stats.duration).toISOString();
    }

    writeFileSync(reportFile, JSON.stringify(report, null, 2), 'utf-8');
    this.ctx.logger.log(`Bamboo report written to ${reportFile}`);
  }
}
