// @ts-check

/**
 * Extracts Project GIDs from Asana Project Links (permalink_url)
 *
 * @link https://developers.asana.com/reference/projects
 * @example getProjectId("https://app.asana.com/0/12345678900/12345678900") // Legacy format
 * @example getProjectId("https://app.asana.com/1/1202191738631953/project/1211168999004702/list/1211170139684016") // New format
 * @param {string | URL } projectLink from Asana's "Copy Project Link"
 * @returns {string | false} Returns the project Id as a numeric string.
 */
export function getProjectId(projectLink = "") {
  projectLink = projectLink.toString();

  // New format: https://app.asana.com/1/{workspace_id}/project/{project_id}/list/{list_id}
  const newFormatPattern = new RegExp("https://app.asana.com/1/\\d+/project/(\\d+)");
  const newMatch = projectLink.match(newFormatPattern);
  if (newMatch) {
    return newMatch[1];
  }

  // Legacy format: https://app.asana.com/0/{project_id}/{project_id}
  const legacyPattern = new RegExp("https://app.asana.com/0/(\\d+)/\\1");
  const legacyMatch = projectLink.match(legacyPattern);
  if (legacyMatch) {
    return legacyMatch[1];
  }

  return false;
}
