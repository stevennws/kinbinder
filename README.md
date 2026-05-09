# 照顧夾

照顧夾 is a Hong Kong family care coordination MVP built with Expo and React Native.

The first version focuses on the daily operating layer for caregivers:

- care recipient profile
- today tasks and reminders
- medication, appointment, measurement, and daily-care task templates
- emergency card with call/share actions
- appointment prep and document folder
- family roles and consent messaging
- Hong Kong support entry points, including 999 and 182 183

The app intentionally does not provide diagnosis, medication advice, or healthcare record integration.

## Run Locally

Install dependencies:

```bash
npm install
```

Start Expo:

```bash
npm start
```

Then open it in Expo Go, an iOS simulator, Android emulator, or Expo web preview.

## MVP Notes

This is a self-contained product prototype. Data is held in local React state so the team can validate flows before adding backend infrastructure.

Next build priorities:

- persistent local storage for emergency card and tasks
- real image/file picker for document upload
- notification scheduling
- authenticated care circles
- role-based access control in a backend
