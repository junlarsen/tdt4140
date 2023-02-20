import { beforeEach, describe } from "vitest";
import { ReviewController } from "../review-controller";
import { ReviewService } from "../review-service";
import { createMockDatabase } from "../sqlite";
import express from "express";

describe("review contoller", () => {
    let database;
    let contoller;
    let app;

    beforeEach(async () => {
        database = createMockDatabase();
        contoller = new ReviewController(new ReviewService(database));
        app = express();
        
    });
});