## ADDED Requirements

### Requirement: Sidebar shows only current tutorial section
The sidebar SHALL display only the navigation items belonging to the current tutorial section when the user is viewing a page within that section. When viewing `/openclaw/*` pages, the sidebar SHALL show only OpenClaw chapters. When viewing `/opencode/*` pages, the sidebar SHALL show only OpenCode chapters. When viewing `/skill/*` pages, the sidebar SHALL show only Skill chapters.

#### Scenario: Viewing OpenClaw tutorial page
- **WHEN** user navigates to any page under `/openclaw/` (e.g., `/openclaw/01-install`)
- **THEN** the sidebar displays only OpenClaw chapter links and the sidebar does NOT display OpenCode or Skill navigation items

#### Scenario: Viewing OpenCode tutorial page
- **WHEN** user navigates to any page under `/opencode/`
- **THEN** the sidebar displays only OpenCode chapter links and the sidebar does NOT display OpenClaw or Skill navigation items

#### Scenario: Viewing Skill tutorial page
- **WHEN** user navigates to any page under `/skill/`
- **THEN** the sidebar displays only Skill chapter links and the sidebar does NOT display OpenClaw or OpenCode navigation items

#### Scenario: Viewing non-tutorial page
- **WHEN** user navigates to a page not under any tutorial section (e.g., homepage or standalone page)
- **THEN** the sidebar displays all tutorial sections as before (fallback to full sidebar)

### Requirement: Header title reflects current tutorial section
The site title in the header SHALL dynamically change to display the current tutorial series name when the user is within a tutorial section.

#### Scenario: Header shows tutorial name in OpenClaw section
- **WHEN** user is viewing any page under `/openclaw/`
- **THEN** the header site title displays "OpenClaw 从零到生产"

#### Scenario: Header shows tutorial name in OpenCode section
- **WHEN** user is viewing any page under `/opencode/`
- **THEN** the header site title displays "OpenCode 从零到生产级"

#### Scenario: Header shows tutorial name in Skill section
- **WHEN** user is viewing any page under `/skill/`
- **THEN** the header site title displays "Skill 编写指南"

#### Scenario: Header shows default title outside tutorial sections
- **WHEN** user is viewing a page not under any tutorial section
- **THEN** the header site title displays the default "宇辰AI编程"

### Requirement: WeChat community section preserved in sidebar
The sidebar SHALL continue to display the WeChat QR code community section below the navigation items, regardless of which tutorial section is active.

#### Scenario: Community section visible in isolated sidebar
- **WHEN** user views any tutorial page with isolated sidebar
- **THEN** the WeChat QR code community section appears below the filtered sidebar navigation
