## ADDED Requirements

### Requirement: Mobile bottom navigation shell
On phone-width viewports the authenticated PWA SHALL present a persistent bottom navigation bar with Home, Explore, Schedule, and Profile destinations. The active destination MUST be visually indicated using the brand primary color.

#### Scenario: Phone bottom nav
- **WHEN** a signed-in member uses the PWA at a phone-width viewport
- **THEN** Home, Explore, Schedule, and Profile are reachable from a bottom navigation bar
- **AND** the current tab uses the brand primary accent

### Requirement: Tablet and desktop sidebar shell
On tablet and desktop viewports the PWA SHALL present the same four destinations in a persistent left sidebar instead of a bottom bar. Content MUST reflow to multi-column layouts where the design uses lists of cards.

#### Scenario: Desktop sidebar
- **WHEN** a signed-in member uses the PWA at a tablet or desktop viewport
- **THEN** navigation appears in a left sidebar with the same four destinations
- **AND** the bottom navigation bar is not shown

### Requirement: Design-kit member surfaces with GymPulse brand
The PWA SHALL follow the light-version layout structure from the approved PWA design kit (onboarding, home, explore, schedule, profile, workout/trainer detail). Primary actions, active states, and key accents MUST use GymPulse landing brand red (`#e31c23` family), not the kit’s green.

#### Scenario: Brand primary on CTAs
- **WHEN** a visitor views Sign In or a primary Reserve/Confirm button
- **THEN** the primary filled button uses GymPulse brand red
- **AND** the overall chrome remains a light background as in the design kit
