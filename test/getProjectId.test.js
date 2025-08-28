// @ts-check

import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from "vitest";

import { getProjectId } from "../lib/util/project-id-from-url.js";

test("Get Project ID from Link URL", () => {
  const projectId = 1200000987654321;
  const projectLink = `https://app.asana.com/0/${projectId}/${projectId}`;
  const actual = getProjectId(projectLink);
  expect(actual).toBe(projectId.toString());
  expect(actual).not.toBe(projectId);
});

test("fail on Task Link URL", () => {
  const taskLink =
    "https://app.asana.com/0/1201186619448742/1206844077072202/f";
  const actual = getProjectId(taskLink);
  expect(actual).toBe(false);
});

test("handles URL objects correctly", () => {
  const projectId = 1200000987654321;
  const projectLink = `https://app.asana.com/0/${projectId}/${projectId}`;
  const projectLinkURL = new URL(projectLink);
  const actual = getProjectId(projectLinkURL);
  expect(actual).toBe(projectId.toString());
});

test("works on large blobs too?", () => {
  const projectId = 1200000987654321;
  const projectLink = `https://app.asana.com/0/${projectId}/${projectId}`;
  const blob = `loremConsectetur ut commodo ad voluptate ${projectLink} dolore do incididunt fugiat ex cupidatat ipsum aliquip nulla sit. Ut in ea est nisi reprehenderit sint. Amet deserunt do consectetur duis magna sit. Occaecat est tempor aliquip nulla et laboris. Ut excepteur non eiusmod aliqua deserunt amet elit esse. Velit quis labore non ullamco occaecat nulla ea sit. Ad occaecat nisi officia velit veniam anim.`;

  const actual = getProjectId(blob);
  expect(actual).toBe(projectId.toString());
});

test("Get Project ID from new format URL", () => {
  const projectId = "1211168999004702";
  const newFormatLink = "https://app.asana.com/1/1202191738631953/project/1211168999004702/list/1211170139684016";
  const actual = getProjectId(newFormatLink);
  expect(actual).toBe(projectId);
});

test("Get Project ID from new format URL with different workspace", () => {
  const projectId = "1234567890123456";
  const newFormatLink = "https://app.asana.com/1/9876543210987654/project/1234567890123456/list/1111111111111111";
  const actual = getProjectId(newFormatLink);
  expect(actual).toBe(projectId);
});

test("handles new format URL objects correctly", () => {
  const projectId = "1211168999004702";
  const newFormatLink = "https://app.asana.com/1/1202191738631953/project/1211168999004702/list/1211170139684016";
  const newFormatURL = new URL(newFormatLink);
  const actual = getProjectId(newFormatURL);
  expect(actual).toBe(projectId);
});

test("works with new format in large blobs", () => {
  const projectId = "1211168999004702";
  const newFormatLink = "https://app.asana.com/1/1202191738631953/project/1211168999004702/list/1211170139684016";
  const blob = `Lorem ipsum dolor sit amet ${newFormatLink} consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`;

  const actual = getProjectId(blob);
  expect(actual).toBe(projectId);
});

test("backward compatibility - still works with legacy format", () => {
  const projectId = 1200000987654321;
  const legacyLink = `https://app.asana.com/0/${projectId}/${projectId}`;
  const actual = getProjectId(legacyLink);
  expect(actual).toBe(projectId.toString());
});

test("returns false for invalid new format URLs", () => {
  const invalidLink = "https://app.asana.com/1/1202191738631953/task/1211168999004702";
  const actual = getProjectId(invalidLink);
  expect(actual).toBe(false);
});
