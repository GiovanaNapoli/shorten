import { describe, it, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { faker } from "@faker-js/faker";

describe("short-url route", () => {
  it("should create a short URL", async () => {
    await server.ready();
    // Arrange
    const longUrl = faker.internet.url();
    // Act
    const response = await request(server.server)
      .post("/short")
      .send({ longUrl });

    // Assert
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("shortUrl");
  });

  it("should return 400 for invalid URL", async () => {
    await server.ready();
    // Arrange
    const longUrl = "invalid-url";
    // Act
    const response = await request(server.server)
      .post("/short")
      .send({ longUrl });

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });

  it("should return 400 for missing longUrl", async () => {
    await server.ready();
    // Act
    const response = await request(server.server).post("/short").send({});

    // Assert
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty("message");
  });
});
