import { BlogsController } from "@/controllers";
import { AuthMiddleware } from "@/middlewares";
import { router, wrapper } from "./base";

router.get("/blogs", BlogsController.getAllBlogs);
router.get("/:slug", BlogsController.getBlogBySlug);
router.post("/blogs", AuthMiddleware.isLoggedIn, BlogsController.createBlog);
router.patch(
	"/blogs/:id",
	AuthMiddleware.isLoggedIn,
	BlogsController.updateBlog
);
router.delete(
	"/blogs/:id",
	AuthMiddleware.isLoggedIn,
	BlogsController.removeBlog
);

export const apiRouter = wrapper(router);
