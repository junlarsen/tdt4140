import { describe, expect, it, beforeEach } from "vitest";
import { ReviewService } from "../review-service";
import { createMockDatabase } from "../sqlite.js";


describe("review service", () => {
    let database;
    let reviewService;

    beforeEach(async () => {
        database = await createMockDatabase();
        reviewService = new ReviewService(database);
    });

    it("can create a review", async () => {
        const review = await reviewService.create({
            userid: 1,
            bookid: 1,
            rating: 8,
            comment: "This book was a nice read",
        });
        expect(review).toStrictEqual({
            user_id: 1,
            book_id: 1,
            rating: 8,
            comment: "This book was a nice read",
        });
    });
})