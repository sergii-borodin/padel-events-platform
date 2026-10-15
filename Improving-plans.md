### Flow to be changed:

1. After the user gpt successfully registered in the system, user should get an email with confirmation;

### Form for event creating:

1. Consider to remove a field from the event creation form description/overview;
2. Make the preview picture more square shaped;
3. Reset the form inputs after a successful event creating;

### In the form to create a new event in the field Organizer I want explicitly set the name of the logged in user that currently logged in. Let's plan the steps to achieve that. What does make sense to consider from perspective of the business logic, software development best practices and good UX. Do not implement. Let's make a step-by-step plan for implementing.

Add a GitHub Actions workflow to the Padel repo that runs Playwright tests on every PR. How to implement it. And what exactly should I consider to test?

Implement the password resetting

On the /events/[slug]/tournament/lineup page fix the form that represents player on the court. So the provided user will take the same amount of space as the default one.

Do not let the creation of the tournament with less than 4 participants

When logged in the auth-nav\_\_trigger button in the nav is empty until, i guess, the check of authentication is not finished. Explore the opportunities to improve UX.

### Implement tournaments with the fast partner.

### Research wether the global.css file is the right way to handle.

### Tournament

The tournament to start or resume, user should be registered in the system and to be organizer.
When a tournament has being started the booking form should not be shown longer.

### Booking event

Make the logged in user to click the button to book the event, show popup to confirm and make a booking form the user info that the system is already know about the user.
Booking-button should be working only for the logged in user. Inform unauthorized users to participate as a guest contacting the organizer (inform that their participation will not be registered and will not be reflected on the rating page).Remove unnecessary fields

### Past events

Do not delete past events, their bookings, or their images. Leave that for later. Rating stays as it is: the number is recomputed from finished tournaments, and those tournaments stay.

Show only events whose calendar date is today or later in Europe/Copenhagen. `date` is a calendar day stored at UTC midnight, so compare it with the start of today in Copenhagen, not with the current time.

1. Add `getStartOfToday` in `lib/utils/eventFilter.ts`, next to the week and month helpers.
2. In `toEventQuery`, set `rangeStart` to that instant for All and Near me. For This week and This month, set `rangeStart` to the later of today and the existing range start, and keep `rangeEnd`. `toEventQuery` already runs outside the cached list, so the day is part of the cache key.
3. In `getEvents`, apply `$gte` when `rangeStart` is set. Apply `$lt` only when `rangeEnd` is set. Today the match runs only when both are set, so All and Near me would stay unfiltered.
4. In `getSimilarEventBySlug`, add the same `$gte`. Pass the start of today in from `EventDetailsContent`, outside `getCachedEventDetails`, so the event page cache key changes with the day.
5. Leave `getEventBySlug`, bookings, tournaments, and rating unchanged.
6. Check `/events` for All, This week, This month, and Near me, plus similar events on an event page. A direct link to a past event still opens.
