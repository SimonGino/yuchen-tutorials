## ADDED Requirements

### Requirement: Monochrome accent color scheme
The site SHALL use a monochrome (black/white/gray) color scheme for all accent colors. All emerald/green accent colors SHALL be replaced with zinc gray tones. The accent color palette SHALL use zinc gray values matching the existing gray palette.

#### Scenario: Accent colors are gray in light mode
- **WHEN** the site is displayed in light mode
- **THEN** all accent-colored elements (links, active states, badges) use zinc gray tones instead of emerald green

#### Scenario: Accent colors are gray in dark mode
- **WHEN** the site is displayed in dark mode
- **THEN** all accent-colored elements use zinc gray tones with sufficient contrast against dark backgrounds

### Requirement: Sidebar active item uses gray highlight
The sidebar active page indicator SHALL use a gray background with rounded corners instead of a green left border. The style SHALL match the reference design (rounded pill/rectangle highlight).

#### Scenario: Active sidebar item appearance
- **WHEN** user is on a specific tutorial page
- **THEN** the corresponding sidebar item has a gray background with rounded corners and does NOT have a colored left border

### Requirement: Links use body color with underline
Content area links SHALL use the body text color with an underline decoration. On hover, links SHALL dim to a lighter gray.

#### Scenario: Link default appearance
- **WHEN** a link is displayed in the content area
- **THEN** the link text color matches the body text color and has an underline

#### Scenario: Link hover appearance
- **WHEN** user hovers over a content area link
- **THEN** the link text color changes to a lighter gray

### Requirement: Code blocks use monochrome styling
Code blocks SHALL use a dark background with gray borders only. The green left accent border on code blocks SHALL be removed.

#### Scenario: Code block appearance
- **WHEN** a code block is displayed in the content area
- **THEN** the code block has a dark background, gray border on all sides, and no colored left accent border

### Requirement: Inline code uses gray background
Inline code elements SHALL use a subtle gray background instead of the current green-tinted background.

#### Scenario: Inline code appearance
- **WHEN** inline code is displayed in the content area
- **THEN** the inline code has a gray-tinted background (no green tint)

### Requirement: Homepage uses monochrome design
The homepage SHALL use the same monochrome color scheme. The terminal-style decorations (`$` prefix, monospace section titles) SHALL be removed. The CTA button SHALL use a black/dark background with white text instead of green.

#### Scenario: Homepage CTA button appearance
- **WHEN** the homepage is displayed
- **THEN** the primary CTA button has a dark background with white text (not green)

#### Scenario: Homepage section titles are plain
- **WHEN** the homepage is displayed
- **THEN** section titles do not have `$` prefix symbols and do not use monospace font

#### Scenario: Homepage hero area is clean
- **WHEN** the homepage is displayed
- **THEN** the hero section does not display a grid/dot background pattern

### Requirement: Admonitions use unified gray styling
All admonition types (note, tip, caution, danger) SHALL use a unified gray color scheme without colored accents.

#### Scenario: Admonition appearance
- **WHEN** any admonition type is displayed in content
- **THEN** the admonition uses gray border and background colors without any colored accent
