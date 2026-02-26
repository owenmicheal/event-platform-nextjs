import posthog from "posthog-js"

const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim()
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST?.trim() || "https://us.i.posthog.com"
const posthogUiHost = posthogHost.includes("eu.i.posthog.com")
  ? "https://eu.posthog.com"
  : "https://us.posthog.com"

if (posthogKey) {
  posthog.init(posthogKey, {
    api_host: "/ingest",
    ui_host: posthogUiHost,
    defaults: '2025-05-24',
    capture_exceptions: true,
    debug: process.env.NODE_ENV === "development",
  })
}
