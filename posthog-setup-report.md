# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the PadelHub events platform. The following changes were made:

- **`instrumentation-client.ts`** (new): Initializes PostHog client-side using the `posthog-js` SDK with the EU host, reverse proxy, exception capture, and debug mode in development.
- **`next.config.ts`** (edited): Added reverse proxy rewrites to route PostHog ingestion through `/ingest/*`, reducing ad-blocker interference. Also set `skipTrailingSlashRedirect: true` as required by PostHog.
- **`app/components/ExploreBtn.tsx`** (edited): Captures `explore_events_clicked` when users click the hero CTA button.
- **`app/components/EventCard.tsx`** (edited): Captures `event_card_clicked` with event title, slug, location, and date properties when users click on an event card.

| Event | Description | File |
|-------|-------------|------|
| `explore_events_clicked` | User clicks the 'Explore Events' CTA button on the home page hero section | `app/components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details; includes event title, slug, location, and date | `app/components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://eu.posthog.com/project/166770/dashboard/644089)
- **Insight**: [Explore Events clicks over time](https://eu.posthog.com/project/166770/insights/YC563JwP)
- **Insight**: [Event card clicks over time](https://eu.posthog.com/project/166770/insights/NGux8IGo)
- **Insight**: [Explore → Event detail conversion funnel](https://eu.posthog.com/project/166770/insights/YCmTOz4v)
- **Insight**: [Most clicked events (by title)](https://eu.posthog.com/project/166770/insights/4ucEWesE)
- **Insight**: [Unique users engaging with events](https://eu.posthog.com/project/166770/insights/qCNLDfnL)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
