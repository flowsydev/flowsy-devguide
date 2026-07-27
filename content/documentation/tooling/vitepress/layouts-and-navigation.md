---
title: VitePress Layouts and Navigation
description: Design of landings, top bar, contextual sidebars and reading paths.
type: guide
audience: People who design the experience of a documentation site.
canonical: true
---

# VitePress Layouts and Navigation

The top bar should show stable areas. Configure the sidebar as a map by prefix so it presents only the current context.

Each area with three or more pages needs a landing with task-oriented routes. Custom layouts may use `hero`, `actions` and `features`, but their `link` fields must pass the same validator as Markdown links.

Flowsy DevGuide uses a `section-home` layout and an auto-collapse sidebar component. When changing navigation, verify desktop, mobile, activation of the current group and return to the section landing.
