import { describe, it, expect } from "vitest";
import request from "supertest";
import { server } from "../app.ts";
import { faker } from "@faker-js/faker";

describe("get-shorted-url route", () => {
  it("should retrieve the original URL for a valid short code", async () => {
    await server.ready();
    // Arrange
    const longUrl = faker.internet.url();
    const postResponse = await request(server.server)
      .post("/short")
      .send({ longUrl });
    const shortUrl = postResponse.body.shortUrl;
    const shortCode = shortUrl.split("/").pop();

    // Act & Assert
    await request(server.server)
      .get(`/${shortCode}`)
      .redirects(0) // prevent automatic redirection
      .expect(301)
      .expect("Location", longUrl);
  });

  it("should return 404 for an invalid short code", async () => {
    await server.ready();
    const invalidShortCode = "invalid";
    await request(server.server)
      .get(`/${invalidShortCode}`)
      .redirects(0) // prevent automatic redirection
      .expect(404)
      .expect((res) => {
        expect(res.body).toHaveProperty("message", "Short URL not found");
      });
  });
});
