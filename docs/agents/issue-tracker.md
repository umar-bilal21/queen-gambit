# Issue tracker

Issues for this repo live in **GitHub Issues** on
[umar-bilal21/queen-gambit](https://github.com/umar-bilal21/queen-gambit).

Use the `gh` CLI:

- Read: `gh issue view <n> --repo umar-bilal21/queen-gambit --comments`
- List: `gh issue list --repo umar-bilal21/queen-gambit --label ready-for-agent`
- Create: `gh issue create --repo umar-bilal21/queen-gambit --title ... --body-file ...`
- Label: `gh issue edit <n> --add-label ready-for-agent`

Blocking edges use a **Blocked by** section in the issue body referencing issue
numbers (`#12`), since GitHub Issues has no native blocking relationship.

**PRs as a request surface:** off. Pull requests are not part of the triage queue.

## Origin

Issue [#1](https://github.com/umar-bilal21/queen-gambit/issues/1) is the client's
original homepage brief. It is the parent of the spec and all tickets. Do not close
or modify it.
