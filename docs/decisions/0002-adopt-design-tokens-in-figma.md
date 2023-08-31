# 2. Adopt Design Tokens in Figma

Date: 2023-08-31

## Status

Accepted

## Context

Design tokens let us codify atomic design decisions in a standardised format. This means they can then be used for interoperability between tools and to propagation of style decisions to code.

We currently have a lite version of Design Tokens, in that we have colour and text set up as local styles in Figma. A full implementation would allow us to tokenise all properties we can represent with primitive data types.

Fully tokenising the system in Figma is the first step to automating a Design to code pipeline.

## Decision

Adopt Design Tokens for colour, border, text style, shadow, sizing and spacing.

## Consequences

+ Move towards a single source of truth for design decisions
+ Better usability of Design properties within Figma
+ Reduce engineering dependency
+ Figma / Docs / Dev kit can be automatically always in sync

- Work involved in set up