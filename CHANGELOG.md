# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.8] - 2022-05-13

### Added

- Added possibility to define multiple selectors for the relative sticky elements as a JSON object.
- Added `refreshRate` option to determine the speed in which sticky states are refreshed.

### Fixed

- Fixed jumping sticky element when it is the tallest element in the container.

## [1.0.7] - 2021-12-29

### Improved

- Improved styles for sticky states inner element to allow the use of nested sticky elements.

### Removed

- Removed method `public.getInstanceFromContainer` as it does not work in many contexts.

## [1.0.6] - 2021-06-02

### Improved

- Improved performance by throttling the changes of state.
- Improved recalculation of sticky state limits when resizing elements and the window.

## [1.0.5] - 2021-05-31

### Fixed

- Fixed calculation of the end threshold to set the end position of the sticky element.

## [1.0.4] - 2021-05-10

### Fixed

- Fixed calculation of sticky element offset position that is used to determine when the element gets the "sticky" state.

### Changed

- Changed function `isStickyPosition` to check for sticky position clues only on the passed element (using `matches` instead of `closest`).
- Changed exposed function `isStickyPosition` as `public`.

## [1.0.1] - 2021-05-07

### Added

- Added support for sticky elements relative to other sticky elements.

## [1.0.0] - 2021-04-13

### Added

- Initial commit.
