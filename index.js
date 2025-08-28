// @ts-check

import * as core from "@actions/core";
import * as github from "@actions/github";

import { findTaskContaining } from "./lib/asana-task-find.js";
import { markTaskComplete } from "./lib/asana-task-completed.js";
import { createTask } from "./lib/asana-task-create.js";
import { updateTask } from "./lib/asana-task-add-story.js";

import { issueToTask } from "./lib/util/issue-to-task.js";
import { getProjectId } from "./lib/util/project-id-from-url.js";

/**
 * Building from the docs here:
 * @link https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action
 */
try {
  const { eventName, payload } = github.context;
  const { action } = payload;

  //
  // TODO: GET THE PROJECT_ID
  //
  // const projectId = "1206848227995333";
  
  // Debug: Log the issue body to see what we're working with
  console.log("Issue body:", payload.issue?.body);
  console.log("Issue body type:", typeof payload.issue?.body);
  
  const projectId = getProjectId(payload.issue?.body);

  // TODO: GET THE SEARCH STRING (html_url)

  const issueSearchString = payload.issue?.html_url;

  // TODO: TOKEN needs to be set on the environment, not so much as an input.
  // const TOKEN = core.getInput("ASANA_PAT");
  // const TOKEN = process.env.ASANA_PAT;
  // const TOKEN = process.env.TOKEN;
  // process.env.TOKEN = process.env.ASANA_PAT;    // this won't work because the connections have already been set up and the env var was missing
  // const payload = JSON.stringify(github.context.payload, null, 2);
  console.log({ projectId, eventName, action, issueSearchString });
  // const payload_str = JSON.stringify(payload, null, 2);
  // console.log(`The '${eventName}' event payload: ${payload_str}`);
  // console.log({ TOKEN });
  // console.log(`token length: ${TOKEN.length}`);
  // console.log(`munged token: ${TOKEN.replace(/[46]/g, "%")}`);

  if (!projectId || !issueSearchString) {
    throw new Error("Unable to find Project ID or Task url");
  }
  // NOTE: Actions must be validated to prevent running in the wrong context if the action is
  //       specified to run on all types or un-handled types.

  let result;

  if (eventName === "issues") {
    if (action === "opened") {
      const taskContent = issueToTask(payload);
      result = await createTask(taskContent, projectId);
    } else if (action === "closed" || action === "reopened") {
      // mark action completed = true, or incomplete = false)

      const theTask = await findTaskContaining(issueSearchString, projectId);
      const completed = !!(action === "closed");
      result = await markTaskComplete(completed, theTask.gid);
    }
  } else if (eventName === "issue_comment" && action === "created") {
    const theTask = await findTaskContaining(issueSearchString, projectId);

    result = await updateTask(github.context.payload, theTask.gid);
  }

  console.log({ eventName, action, result });

  if (result.errors) {
    core.setFailed(JSON.stringify(result, null, 2));
  }
} catch (error) {
  core.setFailed(error.message);
}
