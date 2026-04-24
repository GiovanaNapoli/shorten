import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { faker } from "@faker-js/faker";

describe.sequential("list-urls route", () => {
  beforeEach(async () => {
    await server.ready();
    // Clear collection before each test
    await server.mongo.db.collection("urls").deleteMany({});
  });

  it("should return paginated list of shortened URLs", async () => {
    // Arrange - create 3 URLs
    const longUrl1 = faker.internet.url();
    const longUrl2 = faker.internet.url();
    const longUrl3 = faker.internet.url();
    
    await request(server.server).post("/short").send({ longUrl: longUrl1 });
    await request(server.server).post("/short").send({ longUrl: longUrl2 });
    await request(server.server).post("/short").send({ longUrl: longUrl3 });

    // Act
    const response = await request(server.server)
      .get("/history")
      .query({ page: 1, limit: 10 });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("items");
    expect(response.body).toHaveProperty("meta");
    expect(response.body.items.length).toBeGreaterThanOrEqual(3);
    expect(response.body.meta.page).toBe(1);
    expect(response.body.meta.limit).toBe(10);
    expect(response.body.meta.total).toBeGreaterThanOrEqual(3);
    expect(response.body.meta.totalPages).toBeGreaterThanOrEqual(1);
    
    // Verify our created URLs are in the response (should be the most recent)
    const returnedUrls = response.body.items.map((item: any) => item.longUrl);
    expect(returnedUrls).toContain(longUrl1);
    expect(returnedUrls).toContain(longUrl2);
    expect(returnedUrls).toContain(longUrl3);
  });

  it("should return items with longUrl and complete shortUrl", async () => {
    // Arrange
    const longUrl = faker.internet.url();
    await request(server.server).post("/short").send({ longUrl });

    // Act
    const response = await request(server.server)
      .get("/history")
      .query({ page: 1, limit: 10 });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0]).toHaveProperty("longUrl", longUrl);
    expect(response.body.items[0]).toHaveProperty("shortUrl");
    expect(response.body.items[0].shortUrl).toMatch(/^http:\/\/.+:\d+\/[a-zA-Z0-9]{7}$/);
  });

  it("should return URLs ordered by most recent first", async () => {
    // Arrange - create URLs with slight delay to ensure ordering
    const url1 = faker.internet.url();
    const url2 = faker.internet.url();
    const url3 = faker.internet.url();

    await request(server.server).post("/short").send({ longUrl: url1 });
    await new Promise(resolve => setTimeout(resolve, 10));
    await request(server.server).post("/short").send({ longUrl: url2 });
    await new Promise(resolve => setTimeout(resolve, 10));
    await request(server.server).post("/short").send({ longUrl: url3 });

    // Act
    const response = await request(server.server)
      .get("/history")
      .query({ page: 1, limit: 10 });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.items[0].longUrl).toBe(url3); // most recent
    expect(response.body.items[1].longUrl).toBe(url2);
    expect(response.body.items[2].longUrl).toBe(url1);
  });

  it("should paginate correctly with limit", async () => {
    // Arrange - create 5 URLs
    await Promise.all(
      Array.from({ length: 5 }, () =>
        request(server.server).post("/short").send({ longUrl: faker.internet.url() })
      )
    );

    // Act - request page 1 with limit 2
    const response = await request(server.server)
      .get("/history")
      .query({ page: 1, limit: 2 });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.meta).toEqual({
      page: 1,
      limit: 2,
      total: 5,
      totalPages: 3,
    });
  });

  it("should return correct page when requesting page 2", async () => {
    // Arrange - create 5 URLs
    await Promise.all(
      Array.from({ length: 5 }, () =>
        request(server.server).post("/short").send({ longUrl: faker.internet.url() })
      )
    );

    // Act - request page 2 with limit 2
    const response = await request(server.server)
      .get("/history")
      .query({ page: 2, limit: 2 });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.items).toHaveLength(2);
    expect(response.body.meta).toEqual({
      page: 2,
      limit: 2,
      total: 5,
      totalPages: 3,
    });
  });

  it("should return empty array when no URLs exist", async () => {
    // Act
    const response = await request(server.server)
      .get("/history")
      .query({ page: 1, limit: 10 });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
    expect(response.body.meta).toEqual({
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
    });
  });

  it("should use default values when page and limit are not provided", async () => {
    // Arrange
    await request(server.server).post("/short").send({ longUrl: faker.internet.url() });

    // Act
    const response = await request(server.server).get("/history");

    // Assert
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("items");
    expect(response.body).toHaveProperty("meta");
    expect(response.body.meta.page).toBeGreaterThanOrEqual(1);
    expect(response.body.meta.limit).toBeGreaterThanOrEqual(1);
  });

  it("should return empty items when requesting page beyond total pages", async () => {
    // Arrange - create 2 URLs
    await Promise.all([
      request(server.server).post("/short").send({ longUrl: faker.internet.url() }),
      request(server.server).post("/short").send({ longUrl: faker.internet.url() }),
    ]);

    // Act - request page 5 when only 1 page exists
    const response = await request(server.server)
      .get("/history")
      .query({ page: 5, limit: 10 });

    // Assert
    expect(response.status).toBe(200);
    expect(response.body.items).toEqual([]);
    expect(response.body.meta).toEqual({
      page: 5,
      limit: 10,
      total: 2,
      totalPages: 1,
    });
  });
});
