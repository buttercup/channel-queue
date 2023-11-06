# Channel Queue changelog

## v1.3.0
_2023-11-06_

 * Support throwing error on `waitForEmpty` if task failed, using `throwForFailures` option

## v1.2.0
_2022-04-20_

 * Timeout support for enqueued tasks

## v1.1.1
_2022-04-19_

 * **Bugfix**:
   * `ParallelChannel#waitForEmpty` fired before last callbacks finished

## v1.1.0
_2022-04-14_

 * `Channel#waitForEmpty` and `ParallelChannel#waitForEmpty` helpers

## v1.0.1
_2021-05-30_

 * Fix `enqueue` signature

## v1.0.0
_2021-05-21_

 * Convert to Typescript
 * **Breaking changes**:
   * New type interfaces replace symbols: _see the readme_
   * No default exports: All exports are now named: _see the readme_

## v0.5.0
_2019-11-26_

 * `Channel#clear(priorityType)` for clearing only items with a certain priority type

## v0.4.0
_2019-05-17_

 * `Channel#clear()` for clearing queued items

## v0.3.0
_2018-02-09_

 * Parallelism

## v0.2.2
_2017-10-21_

 * Stacked items support
