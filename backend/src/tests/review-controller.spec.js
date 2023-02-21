import { beforeEach, describe, expect, it } from "vitest";
import { ReviewController } from "../review-controller";
import { ReviewService } from "../review-service";
import { adminOnly, withAuth } from "../middleware.js";
import { createMockDatabase } from "../sqlite";
import express from "express";
import request from "supertest";

describe("review contoller", () => {
    let database;
    let app;
    let reviewController;
    let reviewService;


    beforeEach(async () => {
        database = await createMockDatabase();
        reviewService = new ReviewService(database);
        reviewController = new ReviewController(reviewService);
        app = express();
        app.use(express.json());
        app.post("/api/reviews/", (req, res) =>
          reviewController.create(req, res),
        );
        app.get("/api/reviews/", (req, res) => reviewController.list(req, res));
    });

    it("test create a review", async () => {
        const added = await request(app).post("/api/reviews").send({
          user_id: 1,
          book_id: 1,
          rating: 8,
          comment: "This book was a clean read",
        });
        expect(added.status).toEqual(201);
        expect(added.body).toStrictEqual({
          user_id: 1,
          book_id: 1,
          rating: 8,
          comment: "This book was a clean read",
        });
    });

    it("can list reviews that are registered", async () => {
        const empty = await request(app).get("/api/reviews/");
        expect(empty.status).toEqual(200);
        expect(empty.body).toEqual([]);
        await reviewService.create({
            userid: 2,
            bookid: 2,
            rating: 5,
            comment: "nice",
        });
        const filled = await request(app).get("/api/reviews/");
        expect(filled.status).toEqual(200);
        expect(filled.body).toHaveLength(1);
    });

    
});