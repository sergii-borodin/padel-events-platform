### On the home page will be news by different categories: Lunar league, worldwide, local tournaments. Think about the way and permissions for the user that will be able to upload them.

### After the user got successfully registered in the system, user should get an email with confirmation;

### Form for event creating:

- The alert for the new event creation submitting class="submit-alert". Research if the error message should be removed form UI when the user start change the field value;
- Make the preview picture to be consistent in ratio;
- Make a dropdown list or select for Mexicano and Americano
- Provide hints about possible tags, or provide most popular options. To make most out of it later in the search

### Hide the create event button from unauthorized user on the event page

### Hide the book button for the user that already booked the current event

### Create another state in the filter for the events that user has been booked.

### Add a GitHub Actions workflow to the Padel repo that runs Playwright tests on every PR. How to implement it. And what exactly should I consider to test?

### Implement the password resetting

### Events filter

Add an option to filter events by tag(dropdown list from the most popular tags to less popular)

On the /events/[slug]/tournament/lineup page fix the form that represents player on the court. So the provided user will take the same amount of space as the default one.

### Do not let the creation of the tournament with less than 4 participants

When logged in the auth-nav\_\_trigger button in the nav is empty until, i guess, the check of authentication is not finished. Explore the opportunities to improve UX.

### Creating new tournament

### Implement tournaments with the fast partner.

### Research wether the global.css file is the right way to handle.

### Tournament

The tournament to start or resume, user should be registered in the system and to be organizer.
When a tournament has being started the booking form should not be shown longer.

### Booking event

Make the logged in user to click the button to book the event, show popup to confirm and make a booking form the user info that the system is already know about the user.
Booking-button should be working only for the logged in user. Inform unauthorized users to participate as a guest contacting the organizer (inform that their participation will not be registered and will not be reflected on the rating page).Remove unnecessary fields
