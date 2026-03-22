---
title: "AI Spreadsheets"
summary: "Cursor for Excel"
sortOrder: 999
repoUrl: "https://github.com/BeckWangthumboon/excel-extension"
---

## Project Intro

I built an AI agent that runs inside Excel as a sidebar extension, where users can describe spreadsheet changes and approve edits suggested by the model.

I started this project after my marketing analytics internship at Agoda, where I saw how my boss and my team relied on Excel for most of their work. At the time I was excited about the potential of AI tools, and I wanted to explore whether an assistant could help automate or simplify common spreadsheet workflows. I was inspired mostly by Cursor and Windsurf which had this agent on the sidebar and I wanted to build one for Excel.

This ended up being my first long-running project, lasting a few months. While I did build a working prototype, the more valuable part of the experience was learning how hard it is to design tools without deeply understanding the domain first. Looking back, I was much more excited about what AI could do than about whether I had clearly identified a problem worth solving.

## What I was Trying To Build

The idea was that users could describe changes they wanted to make to a spreadsheet, like cleaning data, generating formulas, restructuring tables and the agent would suggest edits that users could view on screen.

This meant building an Excel Extension that could call Excel's API and modify the spreadsheet based on the tool outputs from the model. 

## Things That Became Harder Than Expected

### Platform Friction

Building on top of Office's platform turned out to be way harder than expected. Documentation and guides were often outdated and unclear, and I felt like I was fighting platform constraints rather than with it.

One thing that surprised me was how the Excel API uses a batched execution model. Instead of directly reading or mutating workbook state, you batch operations functions and call context.sync() to apply them.

```typescript
await Excel.run(async (context) => {
  const sheet = context.workbook.worksheets.getActiveWorksheet();
  const range = sheet.getRange("A1:B2");

  range.load("values");
  await context.sync(); // values become available here

  console.log(range.values);

  range.values = [[1, 2], [3, 4]];
  await context.sync(); // writes are applied here
});
```

Coming from a web background, I wasn't used to this and it took me some time to get used to it.

Another problem that was time consuming was authentication. The webview restricted which domains could be opened, which meant that I couldn't access Google's sign in page through Clerk. I eventually worked around by triggering a login in a dialog and passing the token back to the main webview. Looking back, it was a simple fix, but at the time, this took me a week to figure this out. 

## What I Would Do Differently Today

This project taught me how important it is to validate the platform before you build on it. I chose Excel because I thought the hard problem, the spreadsheet itself, was already solved but in practice I still had to work around the extension limitations and authentication constraints. I just traded one set of problems for another.

I also learned that noticing a tool is widely used is very different from understanding what should be built for it. While I recognized that spreadsheet workflows could be automated, I hadn't developed enough domain expertise to give the project a clear direction.

If I were to revisit this idea, I would spend more time validating spreadsheet workflows and user needs before building. I would also consider building on top of a different platform with better support or build the spreadsheet platform entirely where it could be entirely AI-native and the platform API's would directly support the agent.
