// Admin app
import { authMiddleware } from "@clerk/nextjs";

export default authMiddleware({
  publicRoutes: ["/api/:path*"],
  ignoredRoutes: [
    // Add any routes in the admin app that should not be protected by Clerk authentication
    // For example:
    "/api/",
    // "/admin-public-api/*",
  ],
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
