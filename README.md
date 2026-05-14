# Target

A React Native app built with Expo and Expo Router to help users create, track, and manage financial goals.

## Features

- Create and update financial targets with a name and goal amount
- Track progress toward each goal with a visual progress indicator
- Add income and expense transactions for each target
- View a summary of total entries and exits on the home screen
- Use local persistence with SQLite via Expo
- Clean mobile-first UI with reusable components and currency formatting

## Project structure

- `src/app` - Expo Router screens and navigation
- `src/components` - reusable UI components
- `src/database` - SQLite database access hooks
- `src/utils` - helpers for currency formatting and transaction types

## Getting started

### Prerequisites

- Node.js (recommended latest LTS)
- npm or Yarn
- Android Studio or Xcode for native device/simulator testing

### Clone the repository

```bash
git clone https://github.com/developerantoniosousa/target.git
cd target
```

### Install dependencies

```bash
npm install
```

### Run the app locally

- Start the Expo dev client:

```bash
npm run start
```

- Run on Android device or emulator:

```bash
npm run android
```

- Run on iOS simulator:

```bash
npm run ios
```

## Notes

- The app uses `expo-sqlite` for local persistence
- The default entry point is handled by `expo-router`
- If you are running iOS, make sure CocoaPods dependencies are installed by opening the `ios/` project in Xcode or using `npx pod-install` if needed

## License

This project is licensed under the terms in `LICENSE`.
